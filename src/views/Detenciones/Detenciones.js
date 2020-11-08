// import React from "react";
// import DetencionesMantenciones from "views/Detenciones/Detenciones_mantenciones.js"

// export default function Dashboard() {

//   return (
//     <div>
//       <DetencionesMantenciones/>
//     </div>
//   );
// }
import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import MaterialTable from "material-table";
import { localization } from "variables/language";
import { notify } from 'react-notify-toast';

import {dataMantencionAPI} from 'API/Transc/mantencion';
import {PutUsersAPI,CreateUsersAPI,DeleteUsersAPI} from 'API/Users';
import { Input } from "@material-ui/core";
import { titlesComponenteAPI } from "API/Transc/componente";
import { titlesFallasAPI } from "API/Transc/fallas";
import { titletipoMantencionAPI } from "API/Transc/tipoMantencion";
import { titleEventoAPI } from "API/Transc/eventoMantencion";
// import DeleteLoginAPI from 'API/Users';

const styles = {
    cardCategoryWhite: {
      "&,& a,& a:hover,& a:focus": {
        color: "rgba(255,255,255,.62)",
        margin: "0",
        fontSize: "14px",
        marginTop: "0",
        marginBottom: "0"
      },
      "& a,& a:hover,& a:focus": {
        color: "#FFFFFF"
      }
    },
    cardTitleWhite: {
      color: "#FFFFFF",
      marginTop: "0px",
      minHeight: "auto",
      fontWeight: "300",
      fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
      marginBottom: "3px",
      textDecoration: "none",
      "& small": {
        color: "#777",
        fontSize: "65%",
        fontWeight: "400",
        lineHeight: "1"
      }
    },  
    formControl: {
      margin: 10,
      minWidth: 200,
      maxWidth: 300,
    },
    filtrosbox:{
      width: "70%",
      margin: "auto",
      display: "inline"
    },
    widthdiv:{width: ((window.screen.width*55)/100)}
  };
  
const useStyles = makeStyles(styles);

const customInput = (props)=>{
  return(
  <Input
    type="text"
    value={props.value ? props.value : ""}
    onChange={e => props.onChange(e.target.value)}
  />
)}
export default function ProfileAccounts(props){
  // const hiddenColumn=true;
    //Fecha	Pieza	Ev. SP	Avería	Tipo	Hrs Progr	Hrs No Prog	Event Prog	Event No Prog	RFCA
    //Id_componente Id_mantencion Id_evento Id_tipo Fecha_mantencion CantEvento_especial Duracion Descripcion Horas_programadas Horas_no_programadas Cantidad_evProgramados Cantidad_evNoProgramados RCFA Area OT Id_falla
  const classes = useStyles();
  const [dataMantencion,SetdataMantencion] = React.useState();
  const [hiddenColumn,SethiddenColumn] = React.useState(true);
  const [columns,setColumns] = React.useState();
  const putUsers = PutUsersAPI;
  const mantencionAPI = dataMantencionAPI;

  const setDatos = async ()=>{
    SethiddenColumn(!hiddenColumn);
    var components = await titlesComponenteAPI(); 
    var fallas = await titlesFallasAPI(); //Id_tipo Id_evento Area
    var tipo = await titletipoMantencionAPI();
    var evento = await titleEventoAPI();
    setColumns([ 
      {"title":"ID","field":"Id_mantencion",hidden: hiddenColumn,export:true,editable: 'never',editComponent:customInput},
      {"title":"Fecha","field":"Fecha_mantencion",editComponent:customInput},
      {"title":"Pieza","field":"Id_componente",hidden: hiddenColumn,lookup: components},
      {"title":"Ev.Esp","field":"CantEvento_especial",hidden: hiddenColumn,editComponent:customInput},
      {"title":"Falla","field":"Id_falla",lookup: fallas},
      {"title":"Tipo","field":"Id_tipo",hidden: hiddenColumn,lookup: tipo},
      {"title":"Evento","field":"Id_evento",hidden: hiddenColumn,lookup: evento},
      {"title":"Descripción","field":"Descripcion", headerStyle: { paddingRight: 200 },editComponent:customInput},
      {"title":"Duración(Hrs)","field":"Duracion",editComponent:customInput,align:"center"},
      // {"title":"Tipo","field":"Estado",
      // lookup: { true: "Activa", false: 'Desactivada' }},
      {"title":"Hrs.Prog","field":"Horas_programadas",hidden: hiddenColumn,editComponent:customInput},
      {"title":"Hrs.No Prog","field":"Horas_no_programadas",hidden: hiddenColumn,editComponent:customInput},
      {"title":"Ev.Prog","field":"Cantidad_evProgramados",hidden: hiddenColumn,editComponent:customInput},
      {"title":"Ev.No Prog","field":"Cantidad_evNoProgramados",hidden: hiddenColumn,editComponent:customInput},
      {"title":"RFCA","field":"RCFA",hidden: hiddenColumn,editComponent:customInput},
      {"title":"Area","field":"Area",hidden: hiddenColumn,editComponent:customInput},
      {"title":"OT","field":"OT",hidden: hiddenColumn,editComponent:customInput}
    ])
    var datos = await mantencionAPI()
    .then((res)=>res)
    .catch((error) => console.log(error));
    SetdataMantencion(datos);
  };
  React.useEffect(()=>{
    setDatos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]); 

  const rowAdd = (newData)=>(
    new Promise((resolve, reject) => {
      setTimeout(() => {
        CreateUsersAPI(newData)
        .then((value)=>{
          if (value.errores) {
            notify.show(`${value.errores}`,'error',5000);
          }else{
            SetdataMantencion([...dataMantencion, newData]);
            notify.show('Se ha Añadido con éxito!','success',5000);
          }
          console.log(value)
        })
        resolve();
      }, 0)
    })
  )

  const rowUpdate = (newData, oldData) =>(
    new Promise((resolve, reject) => {
      setTimeout(() => {
        const dataUpdate = [...dataMantencion];
        const index = oldData.tableData.id;
        dataUpdate[index] = newData;
        //set on db
        const msg = putUsers(dataUpdate[index]);
        msg.then((values)=>{
          //alert("Cambiado con exito")                    
          //set on state
          SetdataMantencion([...dataUpdate]);
        })
        .catch((error)=>{
          notify.show('Ha ocurrido un error, intentelo más tarde.','error',5000);
          console.log(error);
        })                        
        resolve();
      }, 0)
    })
  )

  const rowDelete = (oldData) =>(
  new Promise((resolve, reject) => {
    setTimeout(() => {
      const dataDelete = [...dataMantencion];
      const index = oldData.tableData.id;
      dataDelete.splice(index, 1);
      SetdataMantencion([...dataDelete]);
      //set on db
      DeleteUsersAPI(oldData.Rut)
      // console.log(oldData.Rut);
      resolve()
    }, 0)
  })
)
  
return(
    <div >
      <GridContainer >
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
            {/* <h4 className={classes.cardTitleWhite}>Gestión de Mantenciones</h4> */}
            {/* <p className={classes.cardCategoryWhite} >Registro de detenciones de los Chancadores.</p> */}
            <h4 className={classes.cardTitleWhite}>Registro de detenciones de los Chancadores</h4>
            </CardHeader>
            <CardBody>
            <MaterialTable 
              title="Gestión de Mantenciones"
              data={dataMantencion}
              columns={columns}
              parentChildData={(row, rows) => rows.find(a => console.log())}
              editable={hiddenColumn?{
                onRowAdd: rowAdd,                    
                onRowUpdate: rowUpdate,
                onRowDelete: rowDelete
                }:null}
              localization={localization}
              options={{
                exportAllData:true,
                exportButton: true,
                exportDelimiter:";",
                exportFileName:("REG_DETENCIONES_"+new Date().toLocaleString()),
                pageSizeOptions:[5, 10, ,20,100],
              }}   
              actions={[
                {
                  icon: 'view_column',
                  tooltip: 'Mostrar Todo',
                  isFreeAction: true,
                  onClick: (event) => {
                    setDatos();
                  
                  }
                }
              ]}
              // pageSizeOptions={[,"all"]}
              />
            </CardBody>
            <CardFooter>
            {/* <Button color="primary" onClick={handleOpen}>Añadir Usuario</Button> */}
            </CardFooter>
          </Card>
        </GridItem>
          
      </GridContainer>     
      
    </div>
  )
}