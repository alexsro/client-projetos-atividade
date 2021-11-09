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
  Container, Content, ProjectData,
} from './styles';
import Input from '../../components/Input';

interface ProjectFormData {
  name: string;
  start_date: string;
  end_date: string;
}

interface Project {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  percentage_completed: number;
  expired: boolean;
  formatted_start_date: string;
  formatted_end_date: string;
}

const Projects: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProject, setNewProjects] = useState(false);

  useEffect(() => {
    api.get<Project[]>('/stats/projects')
      .then((response) => {
        const formattedProjects = response.data.map((project) => ({
          ...project,
          formatted_start_date: `Início: ${format(parseISO(project.start_date), 'dd/MM/yyyy')}`,
          formatted_end_date: `Fim: ${format(parseISO(project.end_date), 'dd/MM/yyyy')}`,
        }));
        setProjects(formattedProjects);
      });
  }, [newProject]);

  const handleSubmit = useCallback(async (data: ProjectFormData) => {
    try {
      formRef.current?.setErrors({});
      const schema = Yup.object().shape({
        name: Yup.string().required('Nome obrigatório'),
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
        start_date,
        end_date,
      };

      await api.post('/projects', newData);

      setNewProjects(!newProject);
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);
        formRef.current?.setErrors(errors);
      }
    }
  }, [newProject]);

  return (
    <Container>
      <h1>Cadastre seu projeto</h1>
      <header>
        <div>
          <Form ref={formRef} onSubmit={handleSubmit}>
            <span>Nome </span>
            <Input name="name" data-testid="name" />
            <span>Data inicial </span>
            <Input name="start_date" type="date" data-testid="start_date" />
            <span>Data final </span>
            <Input name="end_date" type="date" data-testid="end_date" />
            <Button type="submit">
              Cadastrar novo projeto!
            </Button>
          </Form>
        </div>
      </header>
      <h1>Listagem de projetos</h1>
      <Content>
        <ProjectData>
          {projects.map((project) => (
            <div key={project.id}>
              <span>{project.name}</span>
              <span>{project.formatted_start_date}</span>
              <span>{project.formatted_end_date}</span>
              <span>{`${project.percentage_completed}% completo`}</span>
              <span>{project.expired ? 'Fora do prazo' : 'Dentro do prazo'}</span>
            </div>
          ))}
        </ProjectData>
      </Content>
    </Container>
  );
};

export default Projects;
