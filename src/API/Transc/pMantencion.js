import Cookies from 'universal-cookie';

const cookies = new Cookies();
const {baseURL} = require("../configAPI")

var HeadersGetPMantencion = new Headers();
HeadersGetPMantencion.append("user-token",cookies.get('user-token'));
HeadersGetPMantencion.append("Content-Type", "application/json;charset=UTF-8");

//############################## GET MAQUINARIAS
var requestOptions = {
  method: 'GET',
  headers: HeadersGetPMantencion,
  redirect: 'follow'
};
// export const titlesMaquinariaAPI = async()=>{
//   return await fetch(baseURL+"/maquinaria", requestOptions)
//     .then(response => response.json())
//     .then(value => {
//       // IDMAQUINARIA: NOMBRE
//       var column = {};
//       for (let i = 0; i < Object.keys(value).length; i++) {
//           let key = value[i].Id_maquinaria.toString();
//           let valor = value[i].Nombre_maquinaria.toString();
//           column[key]=valor;
//         }
//       return column;
//     })
//     .catch(error => console.log('error', error));
// }
export const dataPMantencionesAPI = async()=>{
  return await fetch(baseURL+"/pmantencion", requestOptions)
    .then(response => response.json())
    .then(value => {
      return value;
    })
    .catch(error => {
      console.log('error', error);
      return error;
    });
}
//############################## CREATE MAQUINARIA

export const CreateMetasAPI = async(data)=>{
  const {Id_maquinaria, Id_kpi, Anio, Meta} = data;
  var raw = JSON.stringify({
    "Id_maquinaria":`${Id_maquinaria}`,
    "Id_kpi":`${Id_kpi}`,
    "Anio":`${Anio}`,
    "Meta":`${Meta}`,
  });
return fetch(baseURL+"/pmantencion/", {
  method: 'POST',
  headers: HeadersGetPMantencion,
  body: raw,
  redirect: 'follow'
})
  .then(response => response.json())
  .then(result => {
    console.log(result);
    return result;
  })
  .catch(error => {
    console.log('error', error);
    return error;
  });
}

// ############################## DELETE USER

export const DeleteMetasAPI = async(data)=>{
  return await fetch(baseURL+`/pmantencion/${data}`, {
    method: 'DELETE',
    headers: HeadersGetPMantencion,
    redirect: 'follow'
  })
  .then(response => response.text())
  .then(result => {
    console.log(result);
    return result;
  })
  .catch(error => {
    console.log('error', error);
    return error
  });
}

// ############################## UPDATE MAQUINARIA

export const PutMetasAPI = async(data)=>{
    console.log(data)
    const {Id_maquinaria, Id_kpi, Anio, Meta, Id_ProgramaMantencion} = data;
    var raw = JSON.stringify({
        "Id_maquinaria":`${Id_maquinaria}`,
        "Id_kpi":`${Id_kpi}`,
        "Anio":`${Anio}`,
        "Meta":`${Meta}`,
    });
    return await fetch(baseURL+`/pmantencion/${Id_ProgramaMantencion}`, {
      method: 'PUT',
      headers: HeadersGetPMantencion,
      body: raw,
      redirect: 'follow'
    })
      .then(response => response.json())
      .then(result => {
        console.log(result);
        return result;
      })
      .catch(error => {
        console.log('error', error);
        return error;
      });
}


// export default titlesMaquinariaAPI;