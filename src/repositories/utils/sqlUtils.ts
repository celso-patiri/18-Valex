interface MapObjectParam {
  object: Object;
  offset: number;
}

export function mapObjectToUpdateQuery({ object, offset = 1 }: MapObjectParam) {
  const objectColumns = Object.keys(object)
    .map((key, index) => `"${key}"=$${index + offset}`)
    .join(",");
  const objectValues = Object.values(object);

  return { objectColumns, objectValues };
}
