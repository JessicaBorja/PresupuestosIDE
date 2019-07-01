import gql from "graphql-tag";

export const GET_UNITS = gql`
  {
    materialGroups {
      _id
      materialGroupKey
      measurementUnit
      name
      auxMaterials{
          _id
          name
          materialKey
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

export const EDIT_MATERIAL = gql`
mutation UpdateAuxMaterial($id:ID!,$unitPrice:Float,$materialQuantity:Float){
  updateAuxMaterial(id:$id,auxMaterialInput:{unitPrice:$unitPrice,materialQuantity:$materialQuantity}){
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
`;


export const GET_MATERIALS = gql`
{
    materials {
      _id
      materialKey
      measurementUnit
      name
      quantity
      unitPrice
      totalPrice
      fromExcel
    }
  }
`;

