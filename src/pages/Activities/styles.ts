import styled from 'styled-components';
import { shade } from 'polished';

export const Container = styled.div`
  justify-content: center;
  align-items: center;
  margin: 0 auto 0;
  height: calc(100vh - 80px);
  max-width: 1120px;

  > h1 {
    color: #828282;
  }

  > header {
    display: flex;
    align-items: center;
    justify-content: center;

    div {
      width: 100%;
      max-width: 1120px;

      span {
          color: #000;
      }

      form {
        margin: 10px 0;
      }
    }
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  place-content: center;
  margin: 0 auto 0;
  color: #000;
`;

export const ActivitieData = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  & + div {
    margin-top: 16px;
  }

  div {
    margin-top: 8px;
    flex: 1;
    color: #ededef;
    background: #3e3b47;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 24px;
    border-radius: 10px;

    &:hover {
      background: ${shade(0.2, '#3e3b47')};
    }
  }
`;
