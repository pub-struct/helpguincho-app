import { Styler } from '@/theme/styler'


export const styles = Styler(() => ({
  calloutContainer: {
    width: 220,
    padding: 12,
    backgroundColor: '#f00',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  calloutTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  calloutDescription: {
    fontSize: 14,
    color: '#555',
  },
  centerGPS: {
    width: 50,
    height: 50,
    position: 'absolute',
    bottom: 0,
    right: 0,
    marginRight: 5,
    marginBottom: 5,
  }
}))
