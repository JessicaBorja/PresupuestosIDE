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
            materialGroupKey
          }
        }
      }
    }    
`;

// deleteAuxMaterialGroup(id: ID!): AuxMaterialGroup 
export const DELETE_AUXMATGROUP = gql`
mutation DeleteAuxMaterialGroup($id:ID!){
  deleteAuxMaterialGroup(id:$id){
        _id
    }
}
`;

export const GET_AUXMATGROUPS = gql`
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


export const CREATE_AUXMATGROUP= gql`
  mutation CreateAuxMaterialGroup($materialGroup:ID!,$quantity: Float, $unitPrice:Float, $totalPrice: Float){
    createAuxMaterialGroup(auxMaterialGroupInput: { materialGroup: $materialGroup, quantity:$quantity, unitPrice: $unitPrice,totalPrice:$totalPrice}){
          _id
          quantity
          unitPrice
          totalPrice
      }
    }
`;
