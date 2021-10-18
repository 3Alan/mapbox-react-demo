import { useEffect, useRef } from 'react';
import ReactEcharts from 'echarts-for-react';

const option = {
  title: {
    text: 'Temperature Change in Melbourne'
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {},
  toolbox: {
    show: true,
    feature: {
      dataZoom: {
        yAxisIndex: 'none'
      },
      dataView: { readOnly: false },
      magicType: { type: ['line', 'bar'] },
      restore: {},
      saveAsImage: {}
    }
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      formatter: '{value} °F'
    }
  },
  series: [
    {
      name: 'Highest',
      type: 'line',
      data: [78.7, 78, 74.4, 67.7, 61, 56.3, 55.3, 56.9, 61.4, 66, 70.8, 74.7],
      markPoint: {
        data: [
          { type: 'max', name: 'Max' },
          { type: 'min', name: 'Min' }
        ]
      },
      markLine: {
        data: [{ type: 'average', name: 'Avg' }]
      }
    },
    {
      name: 'Lowest',
      type: 'line',
      data: [59.8, 60, 57.4, 52.6, 48.9, 45.4, 44.5, 45, 47.4, 50.1, 53.7, 56.5],
      markPoint: {
        data: [{ name: 'Lowest Month', value: -2, xAxis: 1, yAxis: -1.5 }]
      },
      markLine: {
        data: [
          { type: 'average', name: 'Avg' },
          [
            {
              symbol: 'none',
              x: '90%',
              yAxis: 'max'
            },
            {
              symbol: 'circle',
              label: {
                position: 'start',
                formatter: 'Max'
              },
              type: 'max',
              name: 'Highest Point'
            }
          ]
        ]
      }
    }
  ]
};

export default function Table() {
  const wrapper = useRef(null);
  const obj = useRef(null);
  useEffect(() => {
    const divElement = wrapper.current;
    const vizElement = obj.current;
    if (divElement.offsetWidth > 800) {
      vizElement.style.width = '1000px';
      vizElement.style.height = '827px';
    } else {
      vizElement.style.width = '100%';
      vizElement.style.height = '727px';
    }
    const scriptElement = document.createElement('script');
    scriptElement.src = 'https://public.tableau.com/javascripts/api/viz_v1.js';
    wrapper.current.insertBefore(scriptElement, vizElement);
  }, []);

  return (
    <>
      <div
        style={{
          height: '100vh'
        }}
        id="page-2"
      >
        <div
          ref={wrapper}
          className="tableauPlaceholder"
          id="viz1634545700983"
          style={{ position: 'relative' }}
        >
          <noscript>
            <a href="#">
              <img
                alt="仪表板 1 "
                src="https:&#47;&#47;public.tableau.com&#47;static&#47;images&#47;3D&#47;3DNYKK35P&#47;1_rss.png"
                style="border: none"
              />
            </a>
          </noscript>
          <object ref={obj} className="tableauViz" style={{ display: 'none' }}>
            <param name="host_url" value="https%3A%2F%2Fpublic.tableau.com%2F" />{' '}
            <param name="embed_code_version" value="3" />{' '}
            <param name="path" value="shared&#47;3DNYKK35P" /> <param name="toolbar" value="yes" />
            <param
              name="static_image"
              value="https:&#47;&#47;public.tableau.com&#47;static&#47;images&#47;3D&#47;3DNYKK35P&#47;1.png"
            />
            <param name="animate_transition" value="yes" />
            <param name="display_static_image" value="yes" />
            <param name="display_spinner" value="yes" />
            <param name="display_overlay" value="yes" />
            <param name="display_count" value="yes" />
            <param name="language" value="en-US" />
            <param name="filter" value="publish=yes" />
          </object>
        </div>
      </div>

      <div id="page-3" className="wrapper-center" style={{ height: '100vh' }}>
        <ReactEcharts style={{ width: '90%' }} option={option} />
      </div>
    </>
  );
}
