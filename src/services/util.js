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

const isNumber = c => {
    return c >= '0' && c <= '9'
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

export const isValidDate = (day, month, year) =>
{
    // Check the ranges of month and year
    if(year < 1000 || year > 3000 || month == 0 || month > 12)
        return false;
    const monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
    // Adjust for leap years
    if(year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
        monthLength[1] = 29;
    // Check the range of the day
    return day > 0 && day <= monthLength[month - 1];
};

export const validateEmail = email => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

export const plateSizeValidator = plate => {
    return plate.length != 7 ? false : true
}

export const validatePlateFormat = plate => {
    if (!plateSizeValidator(plate))
        return false
    return isLetter(plate[0]) &&
           isLetter(plate[1]) &&
           isLetter(plate[2]) &&
           isNumber(plate[3]) &&
           (isLetter(plate[4]) || isNumber(plate[4])) &&
           isNumber(plate[5]) &&
           isNumber(plate[6])
}