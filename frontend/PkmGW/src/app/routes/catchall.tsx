import { redirect } from "react-router"
import Login from "../../assets/components/Login"

export async function clientLoader(){
    return redirect("/");

}

export default function DefaultPage(){
    return null;
}