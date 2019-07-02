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
          quantity
          unitPrice
          totalPrice
          materialGroup{
            _id
            name
          }
        }
      }
    }    
`;
