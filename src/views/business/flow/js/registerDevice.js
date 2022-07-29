export default function registerStart(lf) {
  lf.register('device', ({ CircleNode, CircleNodeModel, h }) => {
    // 自定义节点的view
    class View extends CircleNode {}

    // 自定义节点的model
    class Model extends CircleNodeModel {
      // 设置节点属性
      setAttributes() {
        const size = 20
        this.r = size

        // 设置自定义锚点
        this.anchorsOffset = [
          [size, 0],
          [-size, 0]
        ]

        // 自定义连线规则
        const circleOnlyAsTarget = {
          message: '结束节点不能作为连线的起点',
          validate: (source, target) => {
            const sourceData = lf.getNodeDataById(source.id)
            return sourceData.text.value !== '结束'
          }
        }

        // 当节点作为连线的起始节点（source）时的校验规则
        this.sourceRules.push(circleOnlyAsTarget)
      }
    }
    return {
      view: View,
      model: Model
    }
  })
}

