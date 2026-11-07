type Series = 'Sqrt' | 'Fenwick' | 'Segment'

type Benchmark = {
  categories: string[]
  categoryNotes?: string[]
  series: Series[]
  panels: { title?: string, values: (number | null)[][] }[]
  max: number
  tick: number
  digits: number
  unit: string
  axis: string
  conditions: string
  whiskers?: { pixelsPerUnit: number, rows: [number, number][] }
}

export const benchmarks = {
  updates: {
    categories: ['10%', '50%', '90%', '99%'],
    series: ['Sqrt', 'Fenwick', 'Segment'],
    panels: [{ values: [[13.54, 2.28, 9.22], [7.94, 2.20, 6.08], [1.69, 1.77, 2.80], [0.34, 1.79, 1.96]] }],
    max: 18, tick: 4, digits: 2,
    unit: 'ms / 100.000 thao tác',
    axis: 'Tỉ lệ cập nhật',
    conditions: 'n = q = 100.000, Sqrt B = 316, L đều trong [1, n]',
    whiskers: {
      pixelsPerUnit: 45.22,
      rows: [[356, 363], [858, 867], [538, 554], [607, 620], [867, 870], [690, 696], [893, 895], [889, 891], [840, 848], [953, 955], [888, 889], [879, 882]],
    },
  },
  memory: {
    categories: ['Tổng đoạn', 'Min đoạn', 'Max đoạn'],
    series: ['Sqrt', 'Fenwick', 'Segment'],
    panels: [{ values: [[783.8, 1562.6, 2048.0], [783.8, null, 2048.0], [783.8, null, 2048.0]] }],
    max: 2500, tick: 500, digits: 1,
    unit: 'KiB do cấu trúc sở hữu',
    axis: 'Loại truy vấn',
    conditions: 'n = 100.000, giá trị 8 byte, Sqrt B = 316, tính capacity và sizeof',
  },
  blockSize: {
    categories: ['79', '158', '316', '632', '1265'],
    categoryNotes: ['≈ 0,25√n', '≈ 0,5√n', '≈ √n', '≈ 2√n', '≈ 4√n'],
    series: ['Sqrt'],
    panels: [{ values: [[10.52], [7.84], [7.91], [10.67], [17.76]] }],
    max: 22, tick: 5, digits: 2,
    unit: 'ms / 100.000 thao tác',
    axis: 'Kích thước block B',
    conditions: 'n = q = 100.000, cập nhật 50%, L đều trong [1, n], dùng cùng trace',
    whiskers: { pixelsPerUnit: 33.99, rows: [[606, 613], [696, 705], [690, 704], [605, 613], [346, 379]] },
  },
  extremes: {
    categories: ['10%', '50%', '90%', '99%'],
    series: ['Sqrt', 'Segment'],
    panels: [
      { title: 'Min', values: [[31.2, 11.7], [32.4, 9.7], [26.0, 4.5], [24.3, 3.1]] },
      { title: 'Max', values: [[29.3, 11.4], [31.3, 9.5], [26.4, 4.8], [24.6, 3.2]] },
    ],
    max: 45, tick: 10, digits: 1,
    unit: 'ms / 100.000 thao tác',
    axis: 'Tỉ lệ cập nhật',
    conditions: 'n = q = 100.000, Sqrt B = 316, L đều trong [1, n], CPU ghim',
    whiskers: {
      pixelsPerUnit: 16.61,
      rows: [[381, 487], [744, 791], [425, 451], [808, 819], [518, 548], [894, 896], [557, 578], [914, 920], [363, 516], [729, 783], [438, 457], [799, 818], [530, 537], [888, 897], [535, 571], [914, 920]],
    },
  },
  scaling: {
    categories: ['1.000', '10.000', '100.000'],
    series: ['Sqrt', 'Segment'],
    panels: [
      { title: 'Min', values: [[5.0, 5.3], [11.6, 7.2], [30.6, 9.3]] },
      { title: 'Max', values: [[5.1, 5.3], [11.1, 7.4], [31.5, 9.3]] },
    ],
    max: 36, tick: 10, digits: 1,
    unit: 'ms / 100.000 thao tác',
    axis: 'Số phần tử n',
    conditions: 'q = 100.000, cập nhật 50%, L đều trong [1, n], Sqrt B = ⌊√n⌋',
    whiskers: {
      pixelsPerUnit: 18.90,
      rows: [[873, 877], [870, 874], [751, 753], [833, 837], [381, 400], [792, 796], [870, 875], [867, 872], [759, 764], [829, 838], [363, 378], [788, 796]],
    },
  },
} satisfies Record<string, Benchmark>

export function getBenchmark(chart: keyof typeof benchmarks): Benchmark {
  return benchmarks[chart]
}
