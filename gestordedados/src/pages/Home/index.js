import React from 'react';
import { get } from 'lodash';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  FaPen,
  FaPlus,
  FaTrash,
  FaUserCircle,
  FaExclamationTriangle,
} from 'react-icons/fa';

import axios from '../../services/axios';
import Loading from '../../components/Loading';
import { HomeContainer } from '../../styles/GlobalStyles';
import { ProfileContainer, ProfilePicture, NewProfile } from './styled';

export default function Home() {
  const [profiles, setProfiles] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    async function getData() {
      try {
        setIsLoading(true);

        const response = await axios.get('/alunos');
        setProfiles(response.data);

        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    }

    getData();
  }, []);

  const handleDeleteAsk = (e) => {
    e.preventDefault();

    const exclamation = e.currentTarget.nextSibling;
    exclamation.setAttribute('display', 'block');

    e.currentTarget.remove();
  };

  const handleDelete = async (e, id, index) => {
    e.persist();

    try {
      setIsLoading(true);

      await axios.delete(`/alunos/${id}`);

      const novosAlunos = [...profiles];
      novosAlunos.splice(index, 1);
      setProfiles(novosAlunos);

      setIsLoading(false);
    } catch (error) {
      const status = get(error, 'response.status', 0);

      if (status === 401) {
        toast.error('Login necessário.');
      } else {
        toast.error('Ocorreu um erro ao excluir a conta.');
      }
    }

    setIsLoading(false);
  };

  return (
    <HomeContainer>
      <Loading isLoading={isLoading} />

      <ProfileContainer>
        <div className="addbutton">
          <NewProfile to="/profile/">
            <FaPlus className="FaPlus" />
          </NewProfile>
          <span>Adcionar</span>
          <span>.</span>
          <span>.</span>
        </div>

        {profiles.map((profile, index) => (
          <div key={String(profile.id)}>
            <ProfilePicture to={`/profile/${profile.id}/view/`}>
              {get(profile, 'Fotos[0].url', false) ? (
                <img src={String(profile.Fotos[0].url)} alt="" />
              ) : (
                <FaUserCircle className="FaUserCircle" />
              )}
            </ProfilePicture>

            <span>{`${profile.nome} ${profile.sobrenome}`}</span>
            <span>{profile.email}</span>

            <span>
              <Link to={`/profile/${profile.id}/edit`}>
                <FaPen size={16} color="#000000" />
              </Link>

              <Link
                onClick={handleDeleteAsk}
                to={`/profile/${profile.id}/delete`}
              >
                <FaTrash size={16} color="#000000" />
              </Link>

              <FaExclamationTriangle
                size={16}
                color="#000000"
                display="none"
                cursor="pointer"
                onClick={(e) => handleDelete(e, profile.id, index)}
              />
            </span>
          </div>
        ))}
      </ProfileContainer>
    </HomeContainer>
  );
}
