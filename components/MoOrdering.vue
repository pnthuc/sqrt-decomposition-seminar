<template>
  <div class="columns">
    <div>
      <h2>R tăng trong mọi block</h2>
      <p class="small">Khi đổi block, R có thể phải quay lại</p>
      <svg class="zigzag" viewBox="0 0 550 205" role="img" aria-label="R quét từ trái sang phải trong mỗi block, quay lại phía trái khi đổi block">
        <g fill="#102e38" font-weight="700">
          <text x="0" y="28">Block 0</text><text x="0" y="92">Block 1</text><text x="0" y="156">Block 2</text>
        </g>
        <path d="M116 20H518M116 84H518M116 148H518" fill="none" stroke="#006a73" stroke-width="4"/>
        <path d="M505 13L518 20L505 27 M505 77L518 84L505 91 M505 141L518 148L505 155" fill="none" stroke="#006a73" stroke-width="4"/>
        <path d="M518 20L116 84 M518 84L116 148" fill="none" stroke="#855000" stroke-width="2" stroke-dasharray="6 6"/>
        <g class="axis-labels" fill="#45636b">
          <text x="116" y="189">R nhỏ</text><text x="518" y="189" text-anchor="end">R lớn</text>
        </g>
      </svg>
    </div>
    <div class="accent">
      <h2>R đi theo thứ tự zíc zắc</h2>
      <p class="small">Block chẵn tăng, block lẻ giảm</p>
      <svg class="zigzag" viewBox="0 0 550 205" role="img" aria-label="R quét từ trái sang phải ở block chẵn và từ phải sang trái ở block lẻ">
        <g fill="#102e38" font-weight="700">
          <text x="0" y="28">Block 0</text><text x="0" y="92">Block 1</text><text x="0" y="156">Block 2</text>
        </g>
        <path d="M116 20H518 M518 84H116 M116 148H518" fill="none" stroke="#006a73" stroke-width="4"/>
        <path d="M505 13L518 20L505 27 M129 77L116 84L129 91 M505 141L518 148L505 155" fill="none" stroke="#006a73" stroke-width="4"/>
        <path d="M518 20V84 M116 84V148" fill="none" stroke="#855000" stroke-width="2" stroke-dasharray="6 6"/>
        <g class="axis-labels" fill="#45636b">
          <text x="116" y="189">R nhỏ</text><text x="518" y="189" text-anchor="end">R lớn</text>
        </g>
      </svg>
    </div>
  </div>
</template>
