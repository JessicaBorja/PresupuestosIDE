import gql from "graphql-tag";

export const GET_UNIT = gql`
query MaterialGroup($id:ID!)
    {
      materialGroup(id: $id){
        _id
        materialGroupKey
        measurementUnit
        name
        auxMaterials{
          _id
          materialKey
          name
          materialQuantity
          totalQuantity
          measurementUnit
          unitPrice
          totalPrice
          fromExcel
        }
      }
    }    
`;

export const DELETE_MATERIAL = gql`
mutation DeleteAuxMaterial($id:ID!){
  deleteAuxMaterial(id:$id){
        _id
    }
}
`;