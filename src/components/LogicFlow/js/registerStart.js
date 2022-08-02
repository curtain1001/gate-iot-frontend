export default function registerStart(lf) {
  lf.register('start', ({ CircleNode, CircleNodeModel, h }) => {
    class StartNode extends CircleNode {
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
          '开始'
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
    class StartModel extends CircleNodeModel {
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
      // 自定义节点样式属性
      getNodeStyle() {
        const style = super.getNodeStyle()
        // 根据 properties 中 statu 属性来设置颜色
        // const properties = this.properties
        // if (properties.statu === 'pass') {
        //   style.stroke = 'green'
        // } else if (properties.statu === 'reject') {
        //   style.stroke = 'red'
        // } else {
        //   style.stroke = 'rgb(24, 125, 255)'
        // }
        return style
      }
      // 自定义锚点样式
      getAnchorStyle() {
        const style = super.getAnchorStyle()
        style.hover.r = 8
        style.hover.fill = 'rgb(24, 125, 255)'
        style.hover.stroke = 'rgb(24, 125, 255)'
        return style
      }
      // 自定义节点outline
      getOutlineStyle() {
        const style = super.getOutlineStyle()
        style.stroke = '#88f'
        return style
      }
      getConnectedTargetRules() {
        const rules = super.getConnectedTargetRules()
        const notAsTarget = {
          message: '起始节点不能作为连线的终点',
          validate: () => false
        }
        rules.push(notAsTarget)
        return rules
      }
    }
    return {
      view: StartNode,
      model: StartModel
    }
  })
}
