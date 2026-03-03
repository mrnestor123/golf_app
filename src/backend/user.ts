


import { User } from '../model/user.js';
import { supabase } from './db.js';
import { getUserGames } from './game.js';


export {
  searchUsers,
  signInEmail,
  signInWithGoogle,
  signInWithIOS,
  signUpEmail,
  signOut,

  getSession,
  createSession,

  createUser,
  getUser,
  updateUser
};



// Sign in with email/password
async function signInEmail(email: string, password: string) {

  const result = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if(result.error){
    throw new Error(`${result.error.code}`); // is it possible to add a code here ??
  } else {
    return result.data;
  }
}


async function signUpEmail(email: string, password: string) {

  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      emailRedirectTo: 'https://example.com/welcome',
    },
  })

  if (error) throw error
  
  else {
    console.log('DATA', data)
    //createUser()


    return data
  }
  
}


async function signInWithGoogle() {

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/#!/popup-callback`,
      queryParams: { prompt: "select_account" },
      skipBrowserRedirect: true
    } 
  })


  if (error) throw error
  else {
    return data
  }
}

async function getSession(){
  const { data: { session } } = await supabase.auth.getSession()

  if (session) {
    return Promise.resolve(session.user)
  }
}

async function signInWithIOS(provider: string) {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin + '/profile',
    } 
  })
  if (error) throw error
  return data
}


// Sign out
async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}



async function createUser(id: string){

  // create user
  let insertData = await supabase
  .from('users')
  .insert({ id: id })
  .select();

  if (insertData.data && insertData.data.length > 0){
    return Promise.resolve(insertData.data[0]);
  } else {
    return Promise.reject('Error creating user');
  }
}



async function getUser(id:string){

  let { data, error } = await supabase
  .from('users')
  .select('*')
  .eq('id', id)
  .single();
  

  if (error){  
    return Promise.resolve();
  } else {
    let games = await getUserGames(id)
    data.games = games;
    console.log('DATA', data)

    return Promise.resolve(new  User(data));
  }
}





async function createSession(access_token:string, refresh_token: string){

  let { data, error } = await supabase.auth.setSession({
    access_token: access_token,
    refresh_token: refresh_token
  });
  
  console.log('data', data)

  if (error) {
    return Promise.reject(error.message);
  } else {
    return Promise.resolve(data.session);
  }
}


/**
 * Actualiza los datos de un usuario y devuelve el objeto usuario actualizado con sus partidas.
 * @param {string} id - ID del usuario a actualizar
 * @param {Object} userData - Objeto con los datos a actualizar (ej: { name: 'Nuevo Nombre' })
*/
async function updateUser(id, userData) {

    const { data, error } = await supabase
    .from('users')
    .update(userData)
    .eq('id', id)
    .select()
    .single();

    if (error) {
      console.error("Error updating user:", error);
      // Si no se encuentra (PGRST116) o hay otro error, devolvemos null o rechazamos
      return Promise.reject(error.message);
    }
    
    return data;
}


async function searchUsers(query: string): Promise<User[]> {
  if (!query || query.trim().length < 2) return [];

  const { data, error } = await supabase
    .from('users')
    .select('id, user_name, handicap')
    .ilike('user_name', `%${query.trim()}%`)
    .limit(10);

  if (error) {
    console.error('Error searching users:', error);
    return [];
  }

  return data.map((d: any) => new User(d));
}