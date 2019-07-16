import gql from "graphql-tag";

export const GET_UNITS = gql`
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
