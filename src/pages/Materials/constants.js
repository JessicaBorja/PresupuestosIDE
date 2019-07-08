import gql from "graphql-tag";

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

export const EDIT_MATERIAL = gql`
  mutation UpdateMaterial($id: ID!, $name: String, $materialKey:String, $measurementUnit: String, $quantity: Float, $unitPrice: Float,$totalPrice: Float ) {
    updateMaterial(
      id: $id, 
      materialInput: { name: $name, materialKey:$materialKey, measurementUnit: $measurementUnit, quantity: $quantity, unitPrice: $unitPrice, totalPrice:$totalPrice}
      ) {
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
  mutation AddMaterial($name: String, $materialKey: String, $measurementUnit: String, 
    $quantity: Float, $unitPrice: Float, $totalPrice: Float, $fromExcel: Boolean ) {
    createMaterial(materialInput: { name: $name, materialKey: $materialKey, measurementUnit: $measurementUnit, 
      quantity: $quantity, unitPrice: $unitPrice, totalPrice: $totalPrice, fromExcel: $fromExcel}) {
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

export const DELETE_MATERIAL = gql`
mutation DeleteMaterial($id:ID!){
  deleteMaterial(id:$id){
        _id
    }
}
`;


// mutation UpdateAccessory($id: ID!, $name: String!, $code:String!, $totalQuantity: Int, $currentQuantity: Int, $deleted: Boolean) {
//   updateAccessory(
//     id: $id
//     accessoryInput: { name: $name,code:$code, totalQuantity: $totalQuantity, currentQuantity: $currentQuantity, deleted: $deleted }
//   ) {
//     _id
//     name
//     code
//     currentQuantity
//     totalQuantity
//   }
// }
