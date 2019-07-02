import gql from "graphql-tag";

export const GET_CONCEPT = gql`
query Concept($id:ID!)
    {
      concept(id: $id){
        _id
        name
        measurementUnit
        conceptKey
        price
        auxMaterialGroups{
          _id
          materialGroup
          quantity
          unitPrice
          totalPrice
        }
      }
    }    
`;
