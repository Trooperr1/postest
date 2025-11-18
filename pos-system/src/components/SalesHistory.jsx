import { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { salesService } from '../services/db';
import { t } from '../utils/translations';
import { formatCurrency, formatDate, formatTime } from '../utils/receiptPrinter';
import { History, Calendar, DollarSign, ShoppingBag, TrendingUp } from 'lucide-react';

/**
 * Sales History Component
 * Shows all past transactions and daily summary
 */
export default function SalesHistory() {
  // State management
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSale, setSelectedSale] = useState(null);
  const [dailySummary, setDailySummary] = useState(null);

  // Live query to get all sales
  const allSales = useLiveQuery(
    () => salesService.getAllSales(),
    []
  );

  /**
   * Load daily summary when date changes
   */
  useEffect(() => {
    const loadDailySummary = async () => {
      try {
        const summary = await salesService.getDailySalesSummary(selectedDate);
        setDailySummary(summary);
      } catch (error) {
        console.error('Error loading daily summary:', error);
      }
    };

    if (selectedDate) {
      loadDailySummary();
    }
  }, [selectedDate]);

  /**
   * Get sales for selected date
   */
  const salesForSelectedDate = dailySummary?.sales || [];

  /**
   * Handle sale click to show details
   */
  const handleSaleClick = (sale) => {
    setSelectedSale(sale);
  };

  /**
   * Close sale details modal
   */
  const closeSaleDetails = () => {
    setSelectedSale(null);
  };

  /**
   * Get today's date in YYYY-MM-DD format
   */
  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4" dir="rtl">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <History size={32} />
          {t('history.title')}
        </h1>
      </div>

      {/* Date Selector */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="card">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <label className="flex items-center gap-2 font-bold text-gray-700">
              <Calendar size={20} />
              {t('history.selectDate')}:
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="input-field max-w-xs"
            />
            <button
              onClick={() => setSelectedDate(getTodayDate())}
              className="btn-secondary"
            >
              {t('history.today')}
            </button>
          </div>
        </div>
      </div>

      {/* Daily Summary */}
      {dailySummary && (
        <div className="max-w-7xl mx-auto mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Total Sales */}
            <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <div className="flex items-center gap-3">
                <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                  <DollarSign size={32} />
                </div>
                <div>
                  <p className="text-sm opacity-90">{t('history.totalSales')}</p>
                  <p className="text-2xl font-bold">{formatCurrency(dailySummary.totalSales)}</p>
                </div>
              </div>
            </div>

            {/* Total Transactions */}
            <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
              <div className="flex items-center gap-3">
                <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                  <TrendingUp size={32} />
                </div>
                <div>
                  <p className="text-sm opacity-90">{t('history.totalTransactions')}</p>
                  <p className="text-2xl font-bold">{dailySummary.totalTransactions}</p>
                </div>
              </div>
            </div>

            {/* Total Items Sold */}
            <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <div className="flex items-center gap-3">
                <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                  <ShoppingBag size={32} />
                </div>
                <div>
                  <p className="text-sm opacity-90">{t('history.totalItems')}</p>
                  <p className="text-2xl font-bold">{dailySummary.totalItems}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sales List */}
      <div className="max-w-7xl mx-auto">
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">فرۆشتنەکان</h2>

          {salesForSelectedDate.length === 0 ? (
            <div className="text-center py-12">
              <History size={64} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-xl">{t('history.noSales')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {salesForSelectedDate.map((sale, index) => (
                <div
                  key={sale.id}
                  onClick={() => handleSaleClick(sale)}
                  className="bg-gray-50 hover:bg-gray-100 p-4 rounded-lg cursor-pointer transition-colors border-2 border-transparent hover:border-primary-300"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        #{sale.id} - {formatDate(sale.date)} {formatTime(sale.date)}
                      </p>
                      <p className="text-lg font-bold text-gray-800">
                        {sale.items.length} بەرهەم
                      </p>
                    </div>
                    <div className="text-left">
                      <p className="text-2xl font-bold text-primary-600">
                        {formatCurrency(sale.total)}
                      </p>
                    </div>
                  </div>

                  {/* Items Preview */}
                  <div className="mt-2 flex flex-wrap gap-2">
                    {sale.items.map((item, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-white px-2 py-1 rounded border border-gray-300"
                      >
                        {item.name} (×{item.quantity})
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sale Details Modal */}
      {selectedSale && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={closeSaleDetails}
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            dir="rtl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold">وردەکاری فرۆشتن</h2>
                <button
                  onClick={closeSaleDetails}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Sale Info */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">ژمارەی وەسڵ</p>
                    <p className="font-bold text-lg">#{selectedSale.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t('history.date')}</p>
                    <p className="font-bold">{formatDate(selectedSale.date)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t('history.time')}</p>
                    <p className="font-bold">{formatTime(selectedSale.date)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t('history.total')}</p>
                    <p className="font-bold text-xl text-primary-600">
                      {formatCurrency(selectedSale.total)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div>
                <h3 className="font-bold text-lg mb-3">{t('history.items')}</h3>
                <div className="space-y-2">
                  {selectedSale.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-bold">{item.name}</p>
                        <p className="text-sm text-gray-600">
                          {formatCurrency(item.price)} × {item.quantity}
                        </p>
                      </div>
                      <div className="font-bold text-lg text-primary-600">
                        {formatCurrency(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="mt-6 pt-4 border-t-2 space-y-2">
                <div className="flex justify-between text-lg">
                  <span>{t('sales.subtotal')}:</span>
                  <span className="font-bold">{formatCurrency(selectedSale.subtotal)}</span>
                </div>

                {selectedSale.tax > 0 && (
                  <div className="flex justify-between text-lg">
                    <span>{t('sales.tax')}:</span>
                    <span className="font-bold">{formatCurrency(selectedSale.tax)}</span>
                  </div>
                )}

                <div className="flex justify-between text-2xl font-bold text-primary-600 pt-2 border-t">
                  <span>{t('sales.total')}:</span>
                  <span>{formatCurrency(selectedSale.total)}</span>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={closeSaleDetails}
                className="w-full btn-secondary mt-6"
              >
                {t('common.close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
