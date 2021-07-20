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

const isLetter = c => {
    return c.toLowerCase() != c.toUpperCase();
}

export const isBrazilLicensePlateNewModel = plate =>{
    if(plate.length != 7)
        return false
    if(isLetter(plate[4]))
        return true
    return false
}

export const oldModelPlateFormat = plate =>{
    if(plate.length < 3)
        return plate
    let format = plate.substring(0, 3) + '·' +plate.substring(3, plate.length)
    return format
}