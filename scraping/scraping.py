"""
Web Scraper para MSCorecard - Cursos de Disc Golf (con Login)
https://www.mscorecard.com/mscorecard/courses.php
"""

import requests
from bs4 import BeautifulSoup
import json
import csv
import time
from typing import List, Dict
import getpass

class MSCorecardScraper:
    def __init__(self):
        self.base_url = "https://www.mscorecard.com/mscorecard"
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
        self.session = requests.Session()
        self.session.headers.update(self.headers)
        self.logged_in = False
    
    def login(self, username: str, password: str) -> bool:
        """
        Realiza el login en MSCorecard
        """
        # Primero, obtener la página de login para ver si hay tokens CSRF
        login_url = f"{self.base_url}/login.php"
        
        try:
            # Obtener la página de login
            response = self.session.get(login_url, timeout=10)
            soup = BeautifulSoup(response.content, 'lxml')
            
            # Buscar el formulario de login
            form = soup.find('form')
            
            # Preparar datos de login
            login_data = {
                'username': username,
                'password': password,
            }
            
            # Buscar campos ocultos (como tokens CSRF)
            if form:
                hidden_inputs = form.find_all('input', type='hidden')
                for hidden in hidden_inputs:
                    name = hidden.get('name')
                    value = hidden.get('value', '')
                    if name:
                        login_data[name] = value
                
                # Buscar los nombres exactos de los campos
                user_field = form.find('input', {'type': ['text', 'email']})
                pass_field = form.find('input', {'type': 'password'})
                
                if user_field and user_field.get('name'):
                    login_data[user_field.get('name')] = username
                    # Eliminar 'username' si no es el nombre correcto
                    if user_field.get('name') != 'username':
                        login_data.pop('username', None)
                
                if pass_field and pass_field.get('name'):
                    login_data[pass_field.get('name')] = password
                    if pass_field.get('name') != 'password':
                        login_data.pop('password', None)
            
            # Realizar el login
            print("Intentando login...")
            response = self.session.post(login_url, data=login_data, timeout=10)
            
            # Verificar si el login fue exitoso
            if response.status_code == 200:
                # Verificar si hay indicadores de sesión exitosa
                soup = BeautifulSoup(response.content, 'lxml')
                
                # Buscar indicadores de login exitoso
                if 'logout' in response.text.lower() or 'sign out' in response.text.lower():
                    print("✓ Login exitoso")
                    self.logged_in = True
                    return True
                elif 'invalid' in response.text.lower() or 'incorrect' in response.text.lower():
                    print("✗ Credenciales incorrectas")
                    return False
                else:
                    # Intentar acceder a una página protegida para confirmar
                    test_response = self.session.get(f"{self.base_url}/courses.php")
                    if 'login' not in test_response.url.lower():
                        print("✓ Login exitoso (verificado)")
                        self.logged_in = True
                        return True
                    else:
                        print("✗ Login falló")
                        return False
            else:
                print(f"✗ Error en login: Status {response.status_code}")
                return False
                
        except requests.exceptions.RequestException as e:
            print(f"✗ Error de conexión durante login: {e}")
            return False
    
    def check_login_status(self) -> bool:
        """
        Verifica si la sesión sigue activa
        """
        try:
            response = self.session.get(f"{self.base_url}/courses.php", timeout=10)
            
            # Si nos redirige al login, la sesión expiró
            if 'login' in response.url.lower():
                self.logged_in = False
                return False
            
            return True
        except:
            return False
    
    def get_courses_page(self):
        """
        Obtiene la página principal de cursos (requiere login)
        """
        if not self.logged_in:
            print("⚠ No has iniciado sesión")
            return None
        
        url = f"{self.base_url}/courses.php"
        try:
            response = self.session.get(url, timeout=10)
            
            # Verificar si nos redirigió al login
            if 'login' in response.url.lower():
                print("⚠ Sesión expirada. Necesitas hacer login nuevamente.")
                self.logged_in = False
                return None
            
            response.raise_for_status()
            return BeautifulSoup(response.content, 'lxml')
        except requests.exceptions.RequestException as e:
            print(f"Error al obtener la página: {e}")
            return None
    
    def get_all_courses_page(self, page_num: int = 0):
        """
        Obtiene la página con todos los cursos (requiere login)
        """
        if not self.logged_in:
            print("⚠ No has iniciado sesión")
            return None
        
        url = f"{self.base_url}/courses.php?CourseName=&Country=Spain&SubmitButton=Search"
        if page_num > 0:
            url += f"&page={page_num}"


        try:
            response = self.session.get(url, timeout=10)
            
            if 'login' in response.url.lower():
                print("⚠ Sesión expirada")
                self.logged_in = False
                return None
            
            response.raise_for_status()
            return BeautifulSoup(response.content, 'lxml')
        except requests.exceptions.RequestException as e:
            print(f"Error al obtener todos los cursos: {e}")
            return None
    
    def extract_course_data(self, soup) -> List[Dict]:
        """
        Extrae datos de cursos de la página
        """
        courses = []
        
        course_links = soup.find_all('a', class_='no-hover')

        for link in course_links:
            course_data = {}

            # 1. Extraer la URL del curso
            course_url = link.get('href')
            if course_url:
                course_data['url'] = course_url

            # 2. Extraer el nombre del curso
            name_div = link.find('div', style=lambda s: s and 'font-weight: 600' in s)
            if name_div:
                course_data['nombre'] = name_div.text.strip()
            
            # 3. Extraer el tipo de curso (ej. "18-hole course")
            if name_div:
                type_div = name_div.find_next_sibling('div')
                if type_div:
                    course_data['tipo'] = type_div.text.strip()

            # 4. Extraer la ubicación
            location_div = link.find('div', class_='course-location')
            if location_div:
                course_data['ubicacion'] = location_div.text.strip()

            # 5. Verificar si tiene GPS
            gps_icon = link.find('i', class_='material-icons', string='flag')
            course_data['gps_disponible'] = True if gps_icon else False
            
            if course_data.get('nombre'):
                courses.append(course_data)
        
        return courses
    
    def extract_hole_data(self, soup) -> List[Dict]:
        """
        Extrae los datos de los hoyos de la página de detalles de un curso.
        """
        holes = []
        if not soup:
            return holes

        # La tabla de hoyos suele tener esta clase
        table = soup.find('table', class_='table-condensed')
        if not table:
            return holes

        # Iterar sobre las filas de la tabla, saltando la cabecera
        for row in table.find_all('tr')[1:]:
            cells = row.find_all('td')
            if len(cells) >= 3: # Asegurarse de que hay suficientes celdas
                try:
                    hole_data = {
                        'hole_number': int(cells[0].text.strip()),
                        'par': int(cells[1].text.strip()),
                        'distance_meters': int(cells[2].text.strip().split()[0])
                    }
                    holes.append(hole_data)
                except (ValueError, IndexError):
                    # Si alguna conversión falla o no hay celdas, se salta la fila
                    continue
        return holes
    
    def get_course_details(self, course_url: str) -> Dict:
        """
        Obtiene detalles de un curso específico
        """
        if not self.logged_in:
            print("⚠ No has iniciado sesión")
            return None
        
        if not course_url.startswith('http'):
            course_url = f"{self.base_url}/{course_url}"
        
        try:
            response = self.session.get(course_url, timeout=10)
            response.raise_for_status()
            return BeautifulSoup(response.content, 'lxml')
            
        except requests.exceptions.RequestException as e:
            print(f"Error al obtener detalles del curso: {e}")
            return None
    
    def save_to_json(self, data: List[Dict], filename: str = 'mscorecard_courses.json'):
        """Guarda los datos en formato JSON"""
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"✓ Datos guardados en {filename}")
    
    def save_to_csv(self, data: List[Dict], filename: str = 'mscorecard_courses.csv'):
        """Guarda los datos en formato CSV"""
        if not data:
            print("⚠ No hay datos para guardar")
            return
        
        keys = set()
        for item in data:
            keys.update(item.keys())
        
        with open(filename, 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=sorted(keys))
            writer.writeheader()
            writer.writerows(data)
        print(f"✓ Datos guardados en {filename}")
    
    def logout(self):
        """
        Cierra la sesión
        """
        try:
            self.session.get(f"{self.base_url}/logout.php", timeout=10)
            self.logged_in = False
            print("✓ Sesión cerrada")
        except:
            pass


def main():
    """
    Función principal para ejecutar el scraper
    """
    print("=== Scraper de MSCorecard (con Login) ===\n")
    
    scraper = MSCorecardScraper()
    
    # Solicitar credenciales
    username = "barrachinasanernest@gmail.com"
    password = "Lovejustin12!"
    
    # Realizar login
    if not scraper.login(username, password):
        print("\n❌ No se pudo iniciar sesión. Verifica tus credenciales.")
        return
    
    print("\n" + "="*50 + "\n")
    
    # 1. Obtener la lista de todos los cursos
    all_courses = []
    page_num = 0
    while True:
        print(f"Obteniendo cursos de la página {page_num}...")
        list_soup = scraper.get_all_courses_page(page_num)
        
        if not list_soup:
            print("❌ No se pudo acceder a la página de lista de cursos. Terminando.")
            break
            
        courses_on_page = scraper.extract_course_data(list_soup)
        
        if not courses_on_page:
            print("No se encontraron más cursos en la lista.")
            break
        
        all_courses.extend(courses_on_page)
        print(f"✓ {len(courses_on_page)} cursos encontrados en la página {page_num}. Total parcial: {len(all_courses)}")
        page_num += 1
        time.sleep(1)

    # 2. Iterar sobre cada curso para obtener los detalles de los hoyos
    if all_courses:
        print(f"\n" + "="*50)
        print(f"\nIniciando extracción de detalles para {len(all_courses)} cursos...\n")
        
        for i, course in enumerate(all_courses):
            course['id'] = i + 1
            print(f"Procesando curso {course['id']}/{len(all_courses)}: {course.get('nombre', 'Sin Nombre')}")
            
            course_url = course.get('url')
            if course_url:
                details_soup = scraper.get_course_details(course_url)
                if details_soup:
                    holes = scraper.extract_hole_data(details_soup)
                    course['holes'] = holes
                    print(f"  ✓ Encontrados {len(holes)} hoyos.")
                else:
                    course['holes'] = []
                    print(f"  ⚠ No se pudieron obtener detalles para este curso.")
            else:
                course['holes'] = []
                print(f"  ⚠ No se encontró URL para este curso.")
            
            time.sleep(0.5) # Pausa para no sobrecargar el servidor

        # 3. Guardar los datos completos
        print("\n" + "="*50)
        print("\nGuardando todos los datos enriquecidos...")
        scraper.save_to_json(all_courses, 'mscorecard_courses_with_holes.json')
        scraper.save_to_csv(all_courses, 'mscorecard_courses_with_holes.csv')
    else:
        print("\n⚠ No se encontraron cursos para procesar.")
    
    # Cerrar sesión
    scraper.logout()
    print("\n=== Proceso completado ===")
if __name__ == "__main__":
    main()


# ============================================
# MODO INTERACTIVO CON LOGIN
# ============================================

def modo_interactivo():
    """
    Modo interactivo para explorar el sitio (con login)
    """
    scraper = MSCorecardScraper()
    
    # Login inicial
    print("=== Login en MSCorecard ===")
    username = input("Usuario/Email: ")
    password = getpass.getpass("Contraseña: ")
    
    if not scraper.login(username, password):
        print("❌ Login falló. Saliendo...")
        return
    
    while True:
        print("\n" + "="*50)
        print("=== MSCorecard Scraper ===")
        print("1. Ver página principal de cursos")
        print("2. Obtener todos los cursos")
        print("3. Obtener detalles de un curso")
        print("4. Verificar estado de sesión")
        print("5. Salir")
        print("="*50)
        
        opcion = input("\nElige una opción: ")
        
        if opcion == "1":
            soup = scraper.get_courses_page()
            if soup:
                print("\n" + soup.prettify()[:800])
        
        elif opcion == "2":
            soup = scraper.get_all_courses_page()
            if soup:
                courses = scraper.extract_course_data(soup)
                print(f"\n✓ Encontrados {len(courses)} cursos")
                
                if courses and input("\n¿Guardar datos? (s/n): ").lower() == 's':
                    scraper.save_to_json(courses)
                    scraper.save_to_csv(courses)
        
        elif opcion == "3":
            course_url = input("URL del curso: ")
            details = scraper.get_course_details(course_url)
            print("\nDetalles del curso:")
            for key, value in details.items():
                print(f"  {key}: {value}")
        
        elif opcion == "4":
            if scraper.check_login_status():
                print("✓ Sesión activa")
            else:
                print("✗ Sesión expirada")
        
        elif opcion == "5":
            scraper.logout()
            print("¡Hasta luego!")
            break
        
        time.sleep(0.5)

# Descomentar para usar modo interactivo:
# modo_interactivo()