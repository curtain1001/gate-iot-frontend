export default function registerEnd(lf) {
  lf.register('end', ({ CircleNode, CircleNodeModel, h }) => {
    // 自定义节点的view
    class EndView extends CircleNode {
      getLabelShape() {
        const { model } = this.props
        const {
          x,
          y
        } = model
        return h(
          'text',
          {
            fill: '#000000',
            fontSize: 12,
            x: x - 12,
            y: y + 4,
            width: 50,
            height: 25
          },
          '结束'
        )
      }
      getShape() {
        const { model } = this.props
        const {
          x,
          y,
          r
        } = model
        const {
          fill,
          stroke,
          strokeWidth } = model.getNodeStyle()
        return h(
          'g',
          {
          },
          [
            h(
              'circle',
              {
                cx: x,
                cy: y,
                r,
                fill,
                stroke,
                strokeWidth
              }
            ),
            this.getLabelShape()
          ]
        )
      }
    }

    // 自定义节点的model
    class Model extends CircleNodeModel {
      // 自定义节点形状属性
      initNodeData(data) {
        data.text = {
          value: (data.text && data.text.value) || '',
          x: data.x,
          y: data.y + 55,
          dragable: false,
          editable: true
        }
        super.initNodeData(data)
        this.r = 30
      }
      // 设置节点属性
      setAttributes() {
        const size = 30
        this.r = size

        // 设置自定义锚点
        this.anchorsOffset = [
          [-size, 0]
        ]

        // 自定义连线规则
        const circleOnlyAsTarget = {
          message: '结束节点不能作为连线的起点',
          validate: (source, target) => {
            const sourceData = lf.getNodeDataById(source.id)
            return sourceData.type !== '结束'
          }
        }

        // 当节点作为连线的起始节点（source）时的校验规则
        this.sourceRules.push(circleOnlyAsTarget)
      }
    }
    return {
      view: EndView,
      model: Model
    }
  })
}
