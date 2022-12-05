import { Box, Grid, LinearProgress, Paper} from '@mui/material';
//import { MuiChipsInput } from 'mui-chips-input'; 
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BarraAcoesEdicao, DialogoConfirmacao } from '../../shared/components';
import { VForm, VTextField, useVForm, IVFormErrors, VShipField } from '../../shared/forms';
import { LayoutBase } from '../../shared/layouts';
import { EventosService } from '../../shared/services/api/eventos/EventosService';
import  * as yup  from 'yup';
import { useMessageContext } from '../../shared/contexts';

interface IFormData {
  nome: string;
  integrantes: string[];
}
const formValidationSchema: yup.SchemaOf<IFormData> = yup.object().shape({
  nome: yup.string().required().min(3),
  integrantes: yup.array().min(1)
});

export const EventoEditor: React.FC = () => {
  const { id = 'novo' } = useParams<'id'>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [titulo, setTitulo] = useState('');
  const { formRef, save } = useVForm();
  const { showMessage } = useMessageContext();
  const [isOpenDelete, setIsOpenDelete] = useState<boolean>(false);
  //const [integrantes, setIntegrantes] = useState<string[]>([]);
  
  // const handleChange = (integrantes: string[]) => {
  //   setIntegrantes(integrantes);
  // };
  
  useEffect(() => {
    if(id !== 'novo') {
      setIsLoading(true);      
      EventosService.getById(Number(id))
        .then((result) => {
          setIsLoading(false);
          if (result instanceof Error) {
            showMessage({message: result.message , level:'error'});
            navigate('/eventos');
          }else{
            setTitulo(result.nome);
            formRef.current?.setData(result);
          }
        });
    }else{
      formRef.current?.setData({
        nome: ''
      });
    }
  }, [id]);

  const handleSave = (dados: IFormData ) => {
    console.log('aki');
    console.log(dados);
    formValidationSchema.
      validate(dados, { abortEarly:false })
      .then((dadosValidos) =>{
        setIsLoading(true);
        console.log(dadosValidos);
        if(id === 'novo'){
          EventosService.create(dadosValidos)
            .then((result) => {
              setIsLoading(false);
              if(result instanceof Error){
                showMessage({message: result.message, level:'error'});
              }else{
                showMessage({message: 'Registro criado com sucesso', level:'success'});
                navigate('/eventos');
              }
            });
        }else{
          EventosService.updateById(Number(id), {id: Number(id), ...dadosValidos})
            .then((result) => {
              setIsLoading(false);
              if(result instanceof Error){
                showMessage({message: result.message , level:'error'});
              }else{
                showMessage({message: 'Registro alterado com sucesso'  , level:'success'});                
                navigate('/eventos');
              }
            });
        }
      })
      .catch((errors: yup.ValidationError) => {
        const validationsErrors: IVFormErrors = {};
        errors.inner.forEach(error => {
          if(!error.path) return;
          validationsErrors[error.path] = error.message;
        });
        formRef.current?.setErrors(validationsErrors);
      });
  };

  const onDelete = () => {
    setIsOpenDelete(false);
    EventosService.deleteById(Number(id))
      .then(result => {
        if(result instanceof Error){
          showMessage({message: result.message , level:'error'});
        }else{
          showMessage({message:'Registro apagado com sucesso!', level:'success'});
          navigate('/eventos');
        }
      });
  };

  const handleDelete = () => {
    setIsOpenDelete(true);
  };
    
  return (
    <LayoutBase 
      titulo={id === 'novo' ? 'Novo Evento' : titulo}
      toolbar={
        <BarraAcoesEdicao
          rotuloNovo='Novo'
          mostrarNovo={id !== 'novo'}
          mostrarDeletar={id !== 'novo'}
          mostrarSalvar
          prontoSalvar={!isLoading}
          prontoNovo={!isLoading}
          prontoDeletar={!isLoading}
          eventoNovo = {() => navigate('/eventos/detalhe/novo')}
          eventoVoltar = {() => navigate('/eventos')}
          eventoSalvar = {save}
          eventoDeletar = {() => handleDelete()}
        />
      }
    >
      <DialogoConfirmacao
        isOpen={isOpenDelete}
        text="Confirma Exclusão?"
        handleYes={onDelete}
        handleNo={setIsOpenDelete}
      />
      <VForm ref={formRef}  onSubmit={handleSave} >
        <Box margin={1} display="flex" flexDirection="column" component={Paper} variant = "outlined">
          <Grid container direction="column" padding={2} spacing={4}>
            {isLoading && (<Grid item>
              <LinearProgress variant="indeterminate"/>
            </Grid>
            )}
            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                <VTextField
                  fullWidth
                  label="Nome"
                  disabled={isLoading}
                  placeholder="Nome" 
                  onChange={e => setTitulo(e.target.value)}
                  name="nome"/>
              </Grid>
            </Grid>
            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                {/* <MuiChipsInput name="integrantes" fullWidth value={integrantes} onChange={handleChange} placeholder="Integrantes" /> */}
                <VShipField name="integrantes" label="Integrantes" fullWidth disabled={isLoading} placeholder="Integrantes" />
              </Grid>
            </Grid>            
          </Grid>
        </Box>
      </VForm> 
    </LayoutBase>
  );
};