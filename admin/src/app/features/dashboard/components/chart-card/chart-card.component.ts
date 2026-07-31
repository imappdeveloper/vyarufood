import { Component, Input, OnInit, OnChanges, OnDestroy, ElementRef, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import ApexCharts from 'apexcharts';

@Component({
  selector: 'app-chart-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card-modern overflow-hidden">
      <div class="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
        <div>
          <h3 class="text-sm font-semibold text-gray-900">{{ title }}</h3>
          @if (subtitle) { <p class="text-xs text-gray-400 mt-0.5">{{ subtitle }}</p> }
        </div>
        <ng-content></ng-content>
      </div>
      <div class="p-4">
        @if (loading) {
          <div class="space-y-3">
            @for (i of [1,2,3,4]; track i) {
              <div class="h-8 rounded-lg animate-pulse" style="background: linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite;"></div>
            }
          </div>
        } @else if (!hasData) {
          <div class="flex flex-col items-center justify-center py-12 text-center">
            <div class="w-12 h-12 rounded-xl flex items-center justify-center mb-3" style="background: #F8FAFC;">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" stroke-width="1.5"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
            </div>
            <p class="text-sm text-gray-400">No chart data available</p>
          </div>
        } @else {
          <div #chartContainer [style.height.px]="height"></div>
        }
      </div>
    </div>
  `,
  styles: [`@keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }`],
})
export class ChartCardComponent implements OnInit, OnChanges, OnDestroy {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() chartType: 'line' | 'bar' | 'pie' | 'donut' | 'area' = 'line';
  @Input() chartData: any = null;
  @Input() chartCategories: string[] = [];
  @Input() height = 300;
  @Input() loading = false;
  @Input() colors: string[] = ['#6366F1', '#22C55E', '#F59E0B', '#EF4444', '#3B82F6', '#8B5CF6', '#EC4899'];

  private chart: ApexCharts | null = null;

  get hasData(): boolean {
    if (!this.chartData) return false;
    if (Array.isArray(this.chartData)) return this.chartData.length > 0;
    if (this.chartData.series) return this.chartData.series.length > 0;
    return true;
  }

  constructor(private el: ElementRef) {}

  ngOnInit(): void { this.initChart(); }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chartData'] || changes['chartCategories']) {
      this.destroyChart();
      setTimeout(() => this.initChart(), 100);
    }
  }
  ngOnDestroy(): void { this.destroyChart(); }

  private initChart(): void {
    if (!this.hasData || this.loading) return;
    const container = this.el.nativeElement.querySelector('[chartContainer]') || this.el.nativeElement.querySelector('#chart-' + this.title?.replace(/\s/g, ''));
    if (!container) return;

    const series = this.buildSeries();
    const options: any = {
      chart: { type: this.chartType === 'donut' ? 'donut' : this.chartType, height: this.height, toolbar: { show: false }, fontFamily: 'Inter, system-ui, sans-serif' },
      colors: this.colors,
      series: series,
      stroke: { curve: 'smooth', width: this.chartType === 'line' || this.chartType === 'area' ? 2.5 : 0 },
      fill: this.chartType === 'area' ? { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.05 } } : undefined,
      labels: this.chartType === 'pie' || this.chartType === 'donut' ? (this.chartCategories.length ? this.chartCategories : series.map((_: any, i: number) => `Item ${i + 1}`)) : undefined,
      xaxis: this.chartType !== 'pie' && this.chartType !== 'donut' ? { categories: this.chartCategories, axisBorder: { show: false }, axisTicks: { show: false }, labels: { style: { colors: '#94A3B8', fontSize: '11px' } } } : undefined,
      yaxis: this.chartType !== 'pie' && this.chartType !== 'donut' ? { labels: { style: { colors: '#94A3B8', fontSize: '11px' }, formatter: (val: number) => val >= 1000 ? (val / 1000).toFixed(1) + 'k' : val.toString() } } : undefined,
      legend: { show: this.chartType === 'pie' || this.chartType === 'donut', position: 'bottom', labels: { colors: '#64748B', useSeriesColors: false } },
      grid: { borderColor: '#F1F5F9', strokeDashArray: 3 },
      dataLabels: { enabled: false },
      tooltip: { theme: 'light', style: { fontSize: '12px' } },
      plotOptions: this.chartType === 'bar' ? { bar: { borderRadius: 6, columnWidth: '60%' } } : undefined,
    };

    this.chart = new ApexCharts(container, options);
    this.chart.render();
  }

  private buildSeries(): any {
    if (Array.isArray(this.chartData)) {
      return [{ name: 'Value', data: this.chartData }];
    }
    if (this.chartData?.series) return this.chartData.series;
    return [{ name: 'Value', data: Object.values(this.chartData || {}) }];
  }

  private destroyChart(): void {
    if (this.chart) { this.chart.destroy(); this.chart = null; }
  }
}
