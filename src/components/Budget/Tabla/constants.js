import gql from "graphql-tag";

export const GET_CONCEPTS = gql`
{
  concepts {
    _id
    name
    measurementUnit
    conceptKey
    price
    Mo
    noMo
  }
}
`;