import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Grid, IconButton, InputAdornment, LinearProgress, Paper, TextField} from '@mui/material';
import { FileCopy } from '@mui/icons-material';
import  * as yup  from 'yup';

import { BarraAcoesEdicao, DialogoConfirmacao } from '../../shared/components';
import { VForm, VTextField, useVForm, IVFormErrors, VShipField } from '../../shared/forms';
import { LayoutBase } from '../../shared/layouts';
import { EventosService } from '../../shared/services/api/eventos/EventosService';

import { useMessageContext } from '../../shared/contexts';

interface IFormData {
  nome: string;
  integrantes: string[];
}
const formValidationSchema: yup.SchemaOf<IFormData> = yup.object().shape({
  nome: yup.string().required().min(3),
  integrantes: yup.array().defined().min(1)
});

export const EventoEditor: React.FC = () => {
  const { id = 'novo' } = useParams<'id'>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [titulo, setTitulo] = useState('');
  const { formRef, save } = useVForm();
  const { showMessage } = useMessageContext();
  const [isOpenDelete, setIsOpenDelete] = useState<boolean>(false);
  const [url , setUrl] = useState<string>('');
  
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
            setUrl(EventosService.getUrl(result.token));
            formRef.current?.setData(result);
          }
        });
    }else{
      setUrl('');
      formRef.current?.setData({
        nome: '',
        integrantes:[]
      });
    }
  }, [id]);

  const handleSave = (dados: IFormData ) => {
    formValidationSchema.
      validate(dados, { abortEarly:false })
      .then(( dadosValidos ) =>{
        setIsLoading(true);
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
            <Grid container item direction="row" spacing={2} display={id === 'novo' ? 'none' : 'block'}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                <TextField
                  label="Url Evento" 
                  fullWidth
                  aria-label=''
                  value={url}
                  InputProps={{
                    readOnly: true,
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton edge="end" color="primary" onClick={() => navigator.clipboard.writeText(url)}>
                          <FileCopy/>
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                {/* <TextField
                  fullWidth
                  label="Url"
                  value={url}
                  disabled={true}/> */}
              </Grid>
            </Grid>
            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                <VShipField name="integrantes" label="Integrantes" fullWidth disabled={isLoading} placeholder="Integrantes" />
              </Grid>
            </Grid>            
          </Grid>
        </Box>
      </VForm> 
    </LayoutBase>
  );
};