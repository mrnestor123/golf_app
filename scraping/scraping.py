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
    
    def get_all_courses_page(self, page_num: int = 0):
        """
        Obtiene la página con todos los cursos (requiere login)
        """
        if not self.logged_in:
            print("⚠ No has iniciado sesión")
            return None
        
        url = f"{self.base_url}/courses.php?CourseName=&Country=&SubmitButton=Search"
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
    
    def extract_lap_data(self, soup) -> List[Dict]:

        """
        Extrae los datos de los hoyos de la página de detalles de un curso.
        """
        holes = []
        if not soup:
            return holes

        lap = {
            'id': 'lap_gf_' + time.strftime("%Y%m%d%H%M%S"),
            'club_id': 'gf_escorpion_1',
            'holes': [], # list with the id of the holes
            'handicaps': [],
            'slopes': {},
            'course_ratings': {}
        }
        
        table = soup.find('table', class_='scorecardtable')

        if not table:
            return holes
        

        # find the first row to determine column spans, 
        header_row = table.find('tr', class_='total')

        if not header_row:
            return holes
        
        # iteramos sobre la segunda fila para sacar los nombres de las tees
        all_header_rows = table.find_all('tr', class_='total')
        if len(all_header_rows) < 2:
            return holes
        

        second_row = all_header_rows[1].find_all('td')
        tees = []
        current_index = 0

        for cell in second_row:
            if current_index > 2 and cell.text.strip() != 'Par' and cell.text.strip() != 'SI' and cell.text.strip() != 'Hole':
                tees.append({
                    'id': 'tee_' + cell.text.strip().lower().replace(' ', '_'),
                    'name': cell.text.strip(),
                    'index': current_index
                })
              
            current_index += 1

        
        
        # print the tee names in console
        print("Tees:", tees)
        
        # Ahora iteramos sobre las filas de los hoyos
        hole_rows = table.find_all('tr', class_='nonfocus')

        hole_index = 0

        for row in hole_rows:
            cells = row.find_all('td')
            
            # Debug: print all cell contents to see what we're working with
            print(f"Row has {len(cells)} cells:")
            for i, cell in enumerate(cells):
                print(f"  cells[{i}]: '{cell.text.strip()}'")

            if hole_index >= 18:
                for i, tee in enumerate(tees):
                    lap['slopes'][tee['id']] = cells[tee['index']-2].text.strip()
                    lap['course_ratings'][tee['id']] = cells[tee['index']-2].text.strip()
                break
            
            hole_data = {
                'par': '',
                'tees': {},
                'club_id': 'gf_escorpion'
            }

            # Extraer el número del hoyo y par
            if len(cells) >= 3:
                hole_data['number'] = cells[0].text.strip()
                hole_data['par'] = int(cells[1].text.strip())
                
                # Safe access to SI (Stroke Index) in cells[2]
                # The SI values might be hidden in span tags with CSS obfuscation
                si_cell = cells[2]
                si_value = si_cell.text.strip()
                
                # Try to extract from span tags if the main text shows '--'
                if si_value in ['--', '-']:
                    span_tags = si_cell.find_all('span')
                    if span_tags:
                        for span in span_tags:
                            span_text = span.text.strip()
                            if span_text.isdigit():
                                si_value = span_text
                                break
                
                if si_value and si_value != '--' and si_value != '-' and si_value.isdigit():
                    lap['handicaps'].append(int(si_value))
                else:
                    # If SI data not available, use hole number as default handicap order
                    lap['handicaps'].append(int(hole_data['number']))
            else:
                print(f"Warning: Row has insufficient cells ({len(cells)})")
                continue

            
            last_tee_distance = 0

            for i, tee in enumerate(tees):
                if tee['index'] < len(cells):
                    tee_distance = cells[tee['index']].text.strip()
                    
                    print('isdigit', tee_distance.isdigit())

                    try:
                        if last_tee_distance != 0 and tee_distance.isdigit() and int(tee_distance) > int(last_tee_distance):
                            hole_data['tees'][tee['id']] = {
                                'distance': tee_distance,
                                'par': int(hole_data['par']) + 1
                            }
                        else:
                            hole_data['tees'][tee['id']] = tee_distance
                            
                            if tee_distance.isdigit():
                                last_tee_distance = int(tee_distance)

                    except (ValueError, IndexError):
                        continue
            

            hole_index += 1

            
            holes.append(hole_data)

        # Extraer las distancias para hombres
        lap['holes'] = holes

        return [lap,tees]
    
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
    username = "jjjrostersmusic@gmail.com"
    password = "Lovejustin12!"
    
    # Realizar login
    if not scraper.login(username, password):
        print("\n❌ No se pudo iniciar sesión. Verifica tus credenciales.")
        return
    
    print("\n" + "="*50 + "\n")

    details_soup = scraper.get_course_details('https://www.mscorecard.com/mscorecard/showcourse.php?cid=1227522189124_1_1')

    # Debug: Save the HTML to see what we're actually getting
    if details_soup:
        with open('debug_page.html', 'w', encoding='utf-8') as f:
            f.write(str(details_soup))
        print("Saved raw HTML to debug_page.html for inspection")

    course = {'id': 'test_id', 'nombre': 'Test Course'}

    if details_soup:
        lap, tees = scraper.extract_lap_data(details_soup)

        # add lap to a json
        scraper.save_to_json([lap], 'laps.json')
        scraper.save_to_json([tees], 'tees.json')

        
        print(f"  ✓ Encontrado la vuelta con {len(lap['holes'])} hoyos.")
    else:
        print(f"  ⚠ No se pudieron obtener detalles para este curso.")

    return
    
    # 1. Obtener la lista de los primeros 10 páginas de cursos
    
    
    # Cerrar sesión
    scraper.logout()
    print("\n=== Proceso completado ===")
if __name__ == "__main__":
    main()






