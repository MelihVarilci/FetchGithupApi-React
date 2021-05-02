/* Gerekli İmport İşlemleri */
import React, { useState, useEffect} from 'react';
import { Form, Card, Image } from 'semantic-ui-react';
/* Sayfa içerisinde yönlendirme yapabilmek için react-router-dom 'u import ettik*/
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
import './App.css';

function App() {
  // Program işleyişi boyunca kullanmak istedğimiz verilerin tanımlanmasını yapıyoruz.
  const [name, setName] = useState('');
  const [userName, setUserName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [userInput, setUserInput] = useState('');
  const [error, setError] = useState(null);
  const [repositories, setRepositories] = useState([]);
  
  // Sayfa açıldığında örnek bir kullanıcı arayüzünü gösteriyoruz.
  useEffect(() => {
    fetch('https://api.github.com/users/examples')
    .then(res => res.json())
    .then(data => {
      setData(data);
    });
  }, []);

  // Gösterilecek profilde kullanılacak değişkenlerin atamasını yapıyoruz.
  const setData = ({ 
    name, 
    login, 
    followers, 
    following, 
    public_repos, 
    avatar_url,
    repositories
  }) => {
    setName(name);
    setUserName(login);
    setAvatar(avatar_url);
    setRepositories(repositories);
  };

  // Arama input'una girilen değeri döndürüyoruz. 
  const handleSearch = e => {
    setUserInput(e.target.value);
  };

  const handleSubmit = async e => {

    e.preventDefault();
    
    // Github api adresine girilen kullanıcı adı değeri ile giderek kullanıcı adına ait profil bilgilerine eriştik.
    const profile = await fetch(`https://api.github.com/users/${userInput}`);
    // Profil bilgilerini javascript'te kolay işlem yapabilmek için json formatına çevirdik.
    const profileJson = await profile.json();
    // Kullanıcı adına ait repositories bilgilerine erişebilmek için url atamasını yaptık.
    const repositories = await fetch(profileJson.repos_url);
    // Repositories bilgilerini javascript'te kolay işlem yapabilmek için json formatına çevirdik.
    const repoJson = await repositories.json();

    /*************************************************************************************************************/
    // Kullanıcı Adına ait bir profil olup olmadığının kontrolünü yapmaya çalıştık ama bu işlem şu anda çalışmıyor!
    if (profileJson.message) {
      setError(profileJson.message);
    } else {
      setData(profileJson);
      setRepositories(repoJson);
      setError(null);
    }    
  };
  // App.js dosyasının çağırıldığı konuma ne döndüreceğini kodluyoruz.
  return (
    // React-router-dom ile sayfa içinde yönlendirme yapabilmek için ilk olarak <Router> tag larıyla başlıyoruz.
    <Router>
      {/* Switch component'inde url kısmında ilk eşleşme olacak Route'a giriş yapmasını sağladık  */}
      <Switch>
        {/* Route ile Switch yapısını kullanabilmek için path'ler belirttik fakat buradaki exact
            url kısmının tamamını ele alarak karşılaştırma yapmamızı sağladı. Başka çözüm yolu olarak
            bu Route companent'ini en son yazmak olabilirdi. (bu proje için)
        */}
        <Route path="/" exact render={() => (
          <div>
            <div className='navbar'>Github Kullanıcı Arama</div>
            <div className='search'>
               {/* Arama butonuna basıldığında "handleSubmit" fonksiyonunun çalışmasını sağladık. */}
            <Form onSubmit={handleSubmit}>
                <Form.Group>
                  {/* Input'taki değerin her değiştiğinde "handleSearch" fonksiyonunun çalışmasını sağladık. */}
                  <Form.Input 
                    placeholder='Githup Kullanıcısı' 
                    name='github user' 
                    onChange={handleSearch}
                  />
                  <Form.Button content='Ara' />
                </Form.Group>
              </Form>
            </div>
            { error ? (
              <h1>{error}</h1>
            ) : (
              <div className="card">
                <Card>
                  {/* Kullanıcı Adına ait profil fotoğrafını, adını ve kullanıcı adını yazdırdık. () */}
                  <Image src={avatar} wrapped ui={false} />
                  <Card.Content>
                    <Card.Header>{name}<hr></hr></Card.Header>
                    {/* Kullanıcı adına tıklanıldığında kullanıcının repostitory'lerini gösterebilmek için 
                        url kısmını değiştirdik böylece Switch gerekli Route'un çalışmasını sağlayacaktır.
                    */}
                    <Card.Header><Link to={`/repositories/${name}`}>{userName}</Link></Card.Header>
                  </Card.Content>
                </Card>  
              </div>   
            )}    
          </div>
          )}>
          </Route>
          {/* Değişen url'deki name kısmını 'name' değişkenimize atıyoruz, kullanıcı adını kaybetmemek için. */}
          <Route path={`/repositories/${name}`} render={()=>(
            <table className="ui celled table">
              <thead>
                <tr>
                  {/* Gösterilecek bilgilerin başlıklarını ayarlıyoruz. */}
                  <th>ID</th>
                  <th>Repositoriler</th>
                  <th>URL</th>
                  <th>Dil</th>
                </tr>
              </thead>
              <tbody>
                {/* Kullanıcının tüm repository'lerini tek tek dolaşabilmemizi sağladık ve
                    istediğimiz değerleriyazdırdık. 
                */}
                {repositories.map(repo => (
                  <tr>
                    <td>
                      <div className="ui relaxed divided list" key={repo.name}>
                        <div className="item">
                          <i className="large github middle aligned icon"></i>
                          <div className="content">
                              {repo.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="ui relaxed divided list" key={repo.name}>
                        <div className="item">
                          <i className="large github middle aligned icon"></i>
                          <div className="content">
                              {repo.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="ui relaxed divided list" key={repo.name}>
                        <div className="item">
                          <i className="large github middle aligned icon"></i>
                          <div className="content">
                              {/* repository url'lerine tıklanıldığında github sayfasına yönlendirilmesini sağladık. */}
                              <a href={repo.html_url} className="header" target="_blank">{repo.url}</a>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="ui relaxed divided list" key={repo.name}>
                        <div className="item">
                          <i className="large github middle aligned icon"></i>
                          <div className="content">
                              {repo.language}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
                  
              </tbody>
            </table>
          )}>
          </Route>
        </Switch>
    </Router>
  );
}
// Export default App ile bu componentteki fonksiyonlardan hangisin varsayılan olduğunu belirledik.
export default App;
