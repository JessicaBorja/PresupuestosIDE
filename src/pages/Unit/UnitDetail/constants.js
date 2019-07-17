import gql from "graphql-tag";

export const GET_UNITS = gql`
  {
    materialGroups {
      _id
      materialGroupKey
      measurementUnit
      name
      totalPrice
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
        Mo
        noMo
        totalPrice
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
mutation UpdateAuxMaterial($id:ID!,$unitPrice:Float,$materialQuantity:Float,$totalPrice:Float){
  updateAuxMaterial(id:$id,auxMaterialInput:{unitPrice:$unitPrice,materialQuantity:$materialQuantity,totalPrice:$totalPrice}){
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



export const ADD_MATERIAL = gql`
mutation CreateAuxMaterial($name: String, $materialKey:String, $measurementUnit: String, $totalQuantity: Float, $unitPrice: Float,$totalPrice: Float,$materialQuantity:Float,$fromExcel:Boolean){
    createAuxMaterial(auxMaterialInput: { name: $name, materialKey:$materialKey, measurementUnit: $measurementUnit,
         totalQuantity: $totalQuantity, unitPrice: $unitPrice, materialQuantity:$materialQuantity,totalPrice:$totalPrice,fromExcel:$fromExcel}){
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


export const UPDATE_UNIT = gql`
mutation UpdateMaterialGroup($id:ID!,$name: String, $materialGroupKey:String!, $totalPrice: Float,$Mo:Float, $noMo:Float,$measurementUnit: String,$auxMaterials: [ID]){
  updateMaterialGroup(id:$id,materialGroupInput: { name: $name, materialGroupKey:$materialGroupKey, totalPrice:$totalPrice,Mo:$Mo, noMo:$noMo, measurementUnit: $measurementUnit,
      auxMaterials:$auxMaterials }){
        _id
    }
}
`;

// quantity: Int,
// unitPrice: Int,
// totalPrice: Int,
// auxMaterials: [ID]
// updateMaterialGroup(id: ID!, materialGroupInput: MaterialGroupInput!): MaterialGroup
