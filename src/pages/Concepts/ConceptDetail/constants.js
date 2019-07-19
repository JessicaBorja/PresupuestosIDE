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
        Mo
        noMo
        auxMaterialGroups{
          _id
          quantity
          unitPrice
          totalPrice
          Mo
          noMo
          materialGroup{
            _id
            name
            materialGroupKey
            Mo
            noMo
            totalPrice
          }
        }
      }
    }    
`;

export const GET_CONCEPTS = gql`
  {
    concepts {
      _id
      name
      measurementUnit
      conceptKey
      price
    }
  }
`;

// deleteAuxMaterialGroup(id: ID!): AuxMaterialGroup 
export const DELETE_AUXMATGROUP = gql`
mutation DeleteAuxMaterialGroup($id:ID!){
  deleteAuxMaterialGroup(id:$id){
        _id
        unitPrice
        totalPrice
        Mo
        noMo
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
      Mo
      noMo
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
  mutation CreateAuxMaterialGroup($materialGroup:ID!,$quantity: Float, $unitPrice:Float, $totalPrice: Float,$Mo: Float,$noMo: Float){
    createAuxMaterialGroup(auxMaterialGroupInput: { materialGroup: $materialGroup, quantity:$quantity, unitPrice: $unitPrice,totalPrice:$totalPrice,Mo:$Mo,noMo:$noMo}){
        _id
        quantity
        unitPrice
        totalPrice
        Mo
        noMo
        materialGroup{
          _id
          name
          materialGroupKey
          noMo
          Mo
          totalPrice
        }
      }
    }
`;
export const UPDATE_CONCEPT= gql`
mutation UpdateConcept($id:ID!,$conceptKey: String!, $measurementUnit:String, $name: String, $price:Float,$Mo:Float,$noMo:Float,$auxMaterialGroups: [ID]){
  updateConcept(id:$id,conceptInput: { conceptKey: $conceptKey, measurementUnit:$measurementUnit, name: $name,price:$price,Mo:$Mo,noMo:$noMo,auxMaterialGroups:$auxMaterialGroups}){
    _id
    price
    Mo
    noMo
  }
}
`;
export const UPDATE_AUXMAT= gql`
mutation UpdateAuxMaterialGroup($id:ID!,$materialGroup: ID!, $quantity:Float, $unitPrice: Float, $totalPrice:Float,$Mo:Float,$noMo:Float){
  updateAuxMaterialGroup(id:$id,auxMaterialGroupInput: { materialGroup: $materialGroup, quantity:$quantity, unitPrice: $unitPrice,totalPrice:$totalPrice,Mo:$Mo,noMo:$noMo}){
    _id
    materialGroup{
      _id
    }
    quantity
    unitPrice
    totalPrice
    Mo
    noMo
  }
}
`;
