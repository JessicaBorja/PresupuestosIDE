import gql from "graphql-tag";

export const GET_UNITS = gql`
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
        measurementUnit
        name
        materialQuantity
        totalQuantity
        unitPrice
        totalPrice
        fromExcel
    }
}
`;
export const ADD_UNIT = gql`
mutation createMaterialGroup($materialGroupKey: String!,$totalPrice:Float, $measurementUnit:String, $name: String,$auxMaterials:[ID]){
    createMaterialGroup(materialGroupInput: { materialGroupKey: $materialGroupKey,totalPrice:$totalPrice, measurementUnit:$measurementUnit, name: $name,auxMaterials:$auxMaterials}){
        _id
    }
}
`;
