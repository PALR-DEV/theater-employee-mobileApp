import { supabase } from "../config/supabaseConfig";

async function getAllMovies(){

    try {

        const {data, error} = await supabase.from ('Movies').select('*');

        if(error) throw error;

        return data;
        
    } catch (error) {
        throw error;
        
    }

}

export {getAllMovies}