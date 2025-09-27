import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, List, ListItem, ListItemText, TextField, CircularProgress } from '@mui/material';
import { getCurrencyConversion } from '../services/apiCurrencyConversion';

// Currency names and symbols mapping
const currencyMap = {
  AED: { name: 'UAE Dirham', symbol: 'AED' },
  USD: { name: 'US Dollar', symbol: '$' },
  EUR: { name: 'Euro', symbol: '€' },
  GBP: { name: 'British Pound', symbol: '£' },
  INR: { name: 'Indian Rupee', symbol: '₹' },
  PKR: { name: 'Pakistani Rupee', symbol: 'Rs' },
  SAR: { name: 'Saudi Riyal', symbol: 'SAR' },
  CAD: { name: 'Canadian Dollar', symbol: 'CA$' },
  AUD: { name: 'Australian Dollar', symbol: 'A$' },
  JPY: { name: 'Japanese Yen', symbol: '¥' },
  CNY: { name: 'Chinese Yuan', symbol: '¥' },
  RUB: { name: 'Russian Ruble', symbol: '₽' },
  CHF: { name: 'Swiss Franc', symbol: 'CHF' },
  SGD: { name: 'Singapore Dollar', symbol: 'S$' },
  QAR: { name: 'Qatari Riyal', symbol: 'QAR' },
  KWD: { name: 'Kuwaiti Dinar', symbol: 'KWD' },
  BHD: { name: 'Bahraini Dinar', symbol: 'BHD' },
  OMR: { name: 'Omani Rial', symbol: 'OMR' }
};

function CurrencySwitcher({ open, onClose, onSelectCurrency, price }) {
  const [currencies, setCurrencies] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (open) {
      const fetchCurrencies = async () => {
        try {
          setLoading(true);
          const data = await getCurrencyConversion();
          setCurrencies(data.rates || {});
        } catch (err) {
          setError('Failed to load currencies');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchCurrencies();
    }
  }, [open]);

  const handleCurrencySelect = (currencyCode, rate) => {
    const convertedPrice = price * rate;
    onSelectCurrency(currencyCode, rate, convertedPrice);
    onClose();
  };

  const filteredCurrencies = Object.entries(currencies).filter(([code]) => {
    return code.toLowerCase().includes(searchTerm.toLowerCase()) || 
           (currencyMap[code]?.name.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Select Currency</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Search Currency"
          type="text"
          fullWidth
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 2 }}
        />
        
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
            <CircularProgress />
          </div>
        ) : error ? (
          <div style={{ color: 'red', textAlign: 'center', padding: '20px' }}>
            {error}
          </div>
        ) : (
          <List sx={{ maxHeight: '400px', overflow: 'auto' }}>
            {filteredCurrencies.map(([code, rate]) => (
              <ListItem 
                button 
                key={code} 
                onClick={() => handleCurrencySelect(code, rate)}
                divider
              >
                <ListItemText 
                  primary={`${code} - ${currencyMap[code]?.name || code}`} 
                  secondary={`1 AED = ${rate} ${code} | ${price} AED = ${(price * rate).toFixed(2)} ${code}`} 
                />
                <span style={{ fontWeight: 'bold' }}>{currencyMap[code]?.symbol || code}</span>
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CurrencySwitcher; 