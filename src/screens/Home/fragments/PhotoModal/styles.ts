import { Styler } from '@/theme/styler'


export const styles = Styler(({ COLORS }) => ({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND_OPACITY_1, // overlay escuro
    justifyContent: 'center',
    alignItems: 'center',
  },
  borderTop: {
    width: '95%',
    borderRadius: 10,
    paddingTop: 5,
    backgroundColor: COLORS.PRIMARY
  },
  content: {
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: 10,
    padding: 24,
    width: '100%',
  },
  photoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBlock: 15,
    width: '100%',
    gap: 10
  },
  photoPlaceholder: {
    flex: 1,
    height: 100,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.PLACEHOLDER,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photo: {
    width: 70,
    height: 100,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  progressBar: {
    height: 5,
    backgroundColor: COLORS.PLACEHOLDER,
    borderRadius: 3,
    marginVertical: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 3,
  },
}))
