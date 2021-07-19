export const saudacaoHorario = (name) => {
    if (!name) return '' 
    const stamp = new Date();
    const hours = stamp.getHours();
    const first = firstName(name)
    if (hours>=0 && hours<6) {
       return `Boa Madrugada, ${first}`;
   }
   
   if (hours>=6 && hours<12) {
       return `Bom Dia, ${first}`;
   }

   if (hours>=12 && hours<18) {
       return `Boa Tarde, ${first}`;
   }

    if (hours>=18 && hours<24) {
        return `Boa Noite, ${first}`;
    }     
    
   return `Bom Dia, ${first}`
}

const firstName = name => {
    const first = name.substring(0, name.indexOf(' '))
    return first || name
}