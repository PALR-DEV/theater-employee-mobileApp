
import { supabase } from "../config/supabaseConfig";

async function LoginEmployee(email:string, password:string)  {
    try {
        const {data, error} = await supabase.from('Employees').select('*').eq('email', email).eq('password', password)
        if(error) {
            throw error;
        }
        return data;
        
    } catch (error) {
        throw error;
        
    }

}

export default {LoginEmployee}