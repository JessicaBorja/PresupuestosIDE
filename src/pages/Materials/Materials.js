import React, { Component } from 'react'
import Layout from "../../components/Layout/Layout";
import "./Materials.css"
// react table
import ReactTable from 'react-table'
import 'react-table/react-table.css'

const myData = [{
    name: 'Tanner Linsley',
    age: 26,
    friend: {
      name: 'Jason Maurer',
      age: 23,
    }
  },
//   {
//     ...
//   }
]




export class MaterialsPage extends Component {
    render() {
        const myData = 
        [
            {
            name: 'Tanner Linsley',
            age: 26,
            description:'feof',
            friend: 
            {
              name: 'Jason Maurer',
              age: 23,
            }
          },
          {
            name: 'Oscar Rosete',
            age: 27,
            description:'guapo',
            friend: {
              name: 'Erick Rosete',
              age: 21,
            }
          }
        ]
        const myColumns = [
            {
            Header: 'Clave',
            accessor: 'name' // String-based value accessors!
            ,  filterable: true, // Overrides the table option

          }, 
          {
            Header: 'Descripción',
            accessor: 'description', // String-based value accessors!
              filterable: true, // Overrides the table option
            filterMethod: (filter, row) =>{
                console.log(row)
                console.log(filter.id)
                console.log(filter.value)
                console.log(row[filter.id].includes(filter.value))
                return(row[filter.id].startsWith(filter.value) &&
                row[filter.id].endsWith(filter.value))
            }
          },
          {
            Header: 'Unidad',
            accessor: 'name' // String-based value accessors!
          },
          {
            Header: 'Cantidad',
            accessor: 'name' // String-based value accessors!
          },
          {
            Header: 'Precio',
            accessor: 'name' // String-based value accessors!
          },
           {
            Header: 'Descripción',
            accessor: 'age',
            Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
          }, {
            id: 'friendName', // Required because our accessor is not a string
            Header: 'Friend Name',
            accessor: d => d.friend.name // Custom value accessors!
          }, {
            Header: props => <span>Friend Age</span>, // Custom header components!
            accessor: 'friend.age'
          }]

        return (
            <Layout>
                <div className="materials">
                    <p>Materials page</p>
                </div>
                <div style={{'width':'70vw','height':'50vh'}}>
                    <ReactTable
                        data={myData}
                        columns={myColumns}
                        defaultPageSize={5}
                    />
                </div>

            </Layout>
        )
    }
}
export default MaterialsPage
