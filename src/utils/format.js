/**
 * @description 格式化数据
 */

export const handleConfigData = function ({
  dataSource = [],
  labelName = 'name',
  valueName = 'id',
}) {
  return Array.isArray(dataSource)
    ? dataSource.map((item) => {
      const { [labelName]: label, [valueName]: value } = item
      return {
        ...item,
        label,
        value,
      }
    })
    : []
}

export const handleMatchEnumLabel = (value, dataSource) => {
  if (value && Array.isArray(dataSource) && dataSource.length > 0) {
    const matchItem = dataSource.find(({ value: itemValue }) => {
      return value === itemValue
    })
    if (matchItem) {
      return matchItem.label
    }
  }
  return ''
}
