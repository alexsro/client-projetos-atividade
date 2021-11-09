import React, {
  useCallback, useRef, useEffect, useState,
} from 'react';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import { format, parseISO, addDays } from 'date-fns';
import * as Yup from 'yup';
import Button from '../../components/Button';
import api from '../../services/api';
import getValidationErrors from '../../utils/getValidationErrors';

import {
  Container, Content, ActivitieData,
} from './styles';
import Input from '../../components/Input';
import Select from '../../components/Select';

interface ActivitieFormData {
  name: string;
  project_id: number;
  finished: boolean;
  start_date: string;
  end_date: string;
}

interface Project {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
}

interface Activitie {
  id: number;
  name: string;
  project_id: number,
  finished: boolean,
  start_date: string;
  end_date: string;
  formatted_start_date: string;
  formatted_end_date: string;
}

const Activities: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const [activities, setActivities] = useState<Activitie[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [newActivitie, setNewActivities] = useState(false);

  useEffect(() => {
    api.get<Project[]>('/projects')
      .then((response) => {
        setProjects(response.data);
      });
  }, []);

  useEffect(() => {
    api.get<Activitie[]>('/activities')
      .then((response) => {
        const formattedActivities = response.data.map((activitie) => ({
          ...activitie,
          formatted_start_date: `Início: ${format(parseISO(activitie.start_date), 'dd/MM/yyyy')}`,
          formatted_end_date: `Fim: ${format(parseISO(activitie.end_date), 'dd/MM/yyyy')}`,
        }));
        setActivities(formattedActivities);
      });
  }, [newActivitie]);

  const handleSubmit = useCallback(async (data: ActivitieFormData) => {
    try {
      formRef.current?.setErrors({});
      const schema = Yup.object().shape({
        name: Yup.string().required('Nome obrigatório'),
        project_id: Yup.string().required('É obrigatório informar um projeto'),
        finished: Yup.string().required('É obrigatório informar o status da atividade'),
        start_date: Yup.string().required('Data início é obrigatória'),
        end_date: Yup.string().required('Data final é obrigatória'),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      const start_date = addDays(new Date(data.start_date), 1);

      const end_date = addDays(new Date(data.end_date), 1);

      const newData = {
        name: data.name,
        project_id: data.project_id,
        finished: data.finished,
        start_date,
        end_date,
      };

      await api.post('/activities', newData);

      setNewActivities(!newActivitie);
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);
        formRef.current?.setErrors(errors);
      }
    }
  }, [newActivitie]);

  return (
    <Container>
      <h1>Cadastre sua atividade</h1>
      <header>
        <div>
          <Form ref={formRef} onSubmit={handleSubmit}>
            <span>Nome </span>
            <Input name="name" />
            <span>Projeto </span>
            <Select name="project_id">
              {projects.map((project) => (
                <option
                  style={{ color: '#000' }}
                  key={project.id}
                  value={project.id}
                >
                  {project.name}
                </option>
              ))}
            </Select>
            <span>Finalizada </span>
            <Select name="finished">
              <option
                style={{ color: '#000' }}
                value="true"
              >
                Sim
              </option>
              <option
                style={{ color: '#000' }}
                value="false"
              >
                Não
              </option>
            </Select>
            <span>Data inicial </span>
            <Input name="start_date" type="date" />
            <span>Data final </span>
            <Input name="end_date" type="date" />
            <Button type="submit">
              Cadastrar nova atividade!
            </Button>
          </Form>
        </div>
      </header>
      <h1>Listagem de atividades</h1>
      <Content>
        <ActivitieData>
          {activities.map((activitie) => (
            <div key={activitie.id}>
              <span>{activitie.name}</span>
              <span>{activitie.finished ? 'Finalizada' : 'Em andamento'}</span>
              <span>{activitie.formatted_start_date}</span>
              <span>{activitie.formatted_end_date}</span>
            </div>
          ))}
        </ActivitieData>
      </Content>
    </Container>
  );
};

export default Activities;
