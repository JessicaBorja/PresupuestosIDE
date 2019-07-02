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


export const DELETE_UNIT = gql`
mutation DeleteMaterialGroup($id:ID!){
    deleteMaterialGroup(id:$id){
        _id
    }
}
`;

export const DUPLICATE_UNIT = gql`
mutation CreateMaterialGroupCopy($id:ID!,$materialGroupKey: String!, $measurementUnit:String, $name: String,$auxMaterials:[ID]){
    createMaterialGroupCopy(id:$id,materialGroupInput: { materialGroupKey: $materialGroupKey, measurementUnit:$measurementUnit, name: $name,auxMaterials:$auxMaterials}){
        _id
    }
}
`;

// createMaterialGroupCopy(id: ID!, materialGroupInput: MaterialGroupInput!): MaterialGroup

export const ADD_CONCEPT= gql`
mutation CreateConcept($conceptKey: String!, $measurementUnit:String, $name: String,$auxMaterialGroups:[ID],$price:Float){
  createConcept(conceptInput: { conceptKey: $conceptKey, measurementUnit:$measurementUnit,name: $name,price:$price,auxMaterialGroups:$auxMaterialGroups}){
        _id
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

// createAuxMaterialGroup(AuxMaterialGroupInput: AuxMaterialGroupInput!): AuxMaterialGroup
// materialGroup: ID!,
// quantity: Float,
// unitPrice: Float,
// totalPrice: Float,

// createConcept(conceptInput: ConceptInput!): Concept
// {
//   conceptKey: String!,
//   measurementUnit: String,
//   name: String
//   quantity: Int,
//   unitPrice: Int,
//   totalPrice: Int,
//   materialGroups: [ID]
// }