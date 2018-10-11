
function symetric(obj){
    let sym = {}
    for (let prop in obj){
        sym[obj[prop]] = prop
    } 
    return sym
}

export function dateString(d){ 
    if(d){
        d=d.substring(0, 10);
        const dateParts=d.split('-');
        if(dateParts.length>1){
            return dateParts[1]+'/'+dateParts[2]+'/'+dateParts[0];
        }
    }
    return '';
}

export const evoAPI = {
    sEqual:'eq',
    sNotEqual:'ne',
    sStart:'sw',
    sContain:'ct',
    sNotContain:'nct',
    sFinish:'fw',
    sInList:'in',
    sIsNull:'null',
    sIsNotNull:'nn',
    sGreater:'gt',
    sSmaller:'lt',
    sBetween:'bw',
    sNotBetween:'nbw'
}

export const api2i18n = symetric(evoAPI)