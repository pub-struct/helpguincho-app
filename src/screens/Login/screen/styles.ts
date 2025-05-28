import { Styler } from '@/theme/styler'


export const styles = Styler(() => ({
  container: {
    padding: 20,
    flexGrow: 1,
    alignItems: 'center'
  },
  titleContainer: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 15,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  loginContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  label: {
    alignSelf: 'flex-start',
    marginLeft: '10%',
    marginBottom: 5,
  },
  input: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingLeft: 10,
  },
  button: {
    width: '80%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
}))
