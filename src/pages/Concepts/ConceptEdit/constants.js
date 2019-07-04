import gql from "graphql-tag";

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


export const DELETE_CONCEPT = gql`
mutation DeleteConcept($id:ID!){
  deleteConcept(id:$id){
        _id
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

export const DUPLICATE_CONCEPT = gql`
mutation CreateConceptCopy($id:ID!,$conceptKey: String!, $measurementUnit:String, $name: String){
  createConceptCopy(id:$id,conceptInput: { conceptKey: $conceptKey, measurementUnit:$measurementUnit, name: $name}){
      _id
  }
}
`;
// createConceptCopy(id: ID!, conceptInput: ConceptInput!): Concept
// conceptKey: String!,
// measurementUnit: String,
// name: String
// price: Float,
// auxMaterialGroups: [ID]


// createMaterialGroupCopy(id: ID!, materialGroupInput: MaterialGroupInput!): MaterialGroup

export const ADD_CONCEPT= gql`
mutation CreateConcept($conceptKey: String!, $measurementUnit:String, $name: String,$materialGroups:[ID]){
  createConcept(conceptInput: { conceptKey: $conceptKey, measurementUnit:$measurementUnit, name: $name,materialGroups:$materialGroups}){
        _id
    }
}
`;

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