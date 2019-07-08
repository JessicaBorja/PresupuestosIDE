import gql from "graphql-tag";

export const GET_BUDGET = gql`
  {
    materials {
      _id
      materialKey
      measurementUnit
      name
      quantity
      unitPrice
      totalPrice
    }
  }
`;

export const EDIT_BUDGET = gql`
  mutation UpdateAccessory($id: ID!, $name: String, $materialKey:String, $measurementUnit: String, $quantity: Float, $unitPrice: Float,$totalPrice: Float ) {
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
    }
  }
`;