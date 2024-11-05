export async function load({request, cookies, locals}){
    const theme = cookies.get("theme");
    return {
        theme: theme || "light"
    };
}