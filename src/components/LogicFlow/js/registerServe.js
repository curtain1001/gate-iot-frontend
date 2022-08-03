export default function registerServe(lf) {
  lf.register('server', ({ RectNode, RectNodeModel, h }) => {
    // 自定义节点的view
    class View extends RectNode {
      getLabelShape() {
        const { model } = this.props
        const { x, y, width, height } = model
        const style = model.getNodeStyle()
        return h(
          'svg',
          {
            x: x - width / 2 + 5,
            y: y - height / 2 + 5,
            width: 25,
            height: 25,
            viewBox: '0 0 1274 1024'
          },
          h('path', {
            fill: style.stroke,
            d:
                'M640 742.4V853.333333h-85.333333v-174.933333c106.666667-17.066667 192-102.4 209.066666-209.066667h85.333334c-12.8 123.733333-98.133333 230.4-209.066667 273.066667z m-256 0c-115.2-42.666667-196.266667-149.333333-213.333333-273.066667h85.333333c17.066667 106.666667 102.4 192 209.066667 209.066667V853.333333H384v-110.933333zM605.866667 213.333333C674.133333 213.333333 725.333333 260.266667 725.333333 332.8c0 59.733333-51.2 123.733333-89.6 157.866667-25.6 25.6-68.266667 51.2-123.733333 81.066666-55.466667-29.866667-98.133333-55.466667-123.733333-81.066666-42.666667-38.4-89.6-98.133333-89.6-157.866667C298.666667 260.266667 349.866667 213.333333 418.133333 213.333333c38.4 0 68.266667 17.066667 93.866667 46.933334 25.6-29.866667 55.466667-46.933333 93.866667-46.933334z'
          })
        )
      }
      /**
     * 完全自定义节点外观方法
     */
      getShape() {
        // eslint-disable-next-line no-unused-vars
        const { model, graphModel } = this.props
        const { x, y, width, height, radius } = model
        const style = model.getNodeStyle()
        return h('g', {}, [
          h('rect', {
            ...style,
            x: x - width / 2,
            y: y - height / 2,
            rx: radius,
            ry: radius,
            width,
            height
          }),
          h('text',
            {
              fill: '#000000',
              fontSize: 12,
              x: x - 12,
              y: y + 4,
              width: 50,
              height: 25
            },
            '服务'),
          this.getLabelShape()
        ])
      }
    }

    // 自定义节点的model
    class Model extends RectNodeModel {
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
      }
      // 设置节点属性
      setAttributes() {
        this.width = 120
        this.height = 60
        this.dragable = false
        this.editable = true
        // 设置自定义锚点
        this.anchorsOffset = [
          [0, this.height / 2],
          [0, -this.height / 2]
        ]

        // 自定义连线规则
        const circleOnlyAsTarget = {
          message: '',
          validate: (source, target) => {
            const edgeData = lf.getGraphData().edges || []
            let curSourceId = null
            const targetIds = []
            for (let i = 0; i < edgeData.length; i++) {
              if (edgeData[i].targetNodeId === source.id) {
                curSourceId = edgeData[i].sourceNodeId
                break
              }
            }

            edgeData.forEach(item => {
              if (curSourceId && item.sourceNodeId === curSourceId) {
                targetIds.push(item.targetNodeId)
              }
            })
            if (curSourceId && curSourceId === target.id) {
              circleOnlyAsTarget.message = '无法连接'
              return false
            } else if (targetIds.includes(target.id)) {
              circleOnlyAsTarget.message = '相邻节点无法连接'
              return false
            } else {
              return true
            }
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

