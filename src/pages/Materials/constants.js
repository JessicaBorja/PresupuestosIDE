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
    }
  }
`;
