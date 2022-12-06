import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LayoutBase } from '../../shared/layouts';
import { EventosService } from '../../shared/services/api/eventos/EventosService';

import { useMessageContext } from '../../shared/contexts';
import { Box, Grid, IconButton, InputAdornment, LinearProgress, Paper, TextField } from '@mui/material';
import { FileCopy } from '@mui/icons-material';
import { VShipField } from '../../shared/forms';

export const KudoEditor: React.FC = () => {
  const token = useParams<'token'>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [titulo, setTitulo] = useState('');
  const { showMessage } = useMessageContext();
  const [url , setUrl] = useState<string>('');
  
  useEffect(() => {
    setIsLoading(true);      
    //   EventosService.getByToken(token)
    //     .then((result) => {
    //       setIsLoading(false);
    //       if (result instanceof Error) {
    //         showMessage({message: result.message , level:'error'});
    //         navigate('/eventos');
    //       }else{
    //         setTitulo(result.nome);
    //         setUrl(EventosService.getUrl(result.token));
    //         formRef.current?.setData(result);
    //       }
    //     });
  }, [token]);
     
  return (
    <LayoutBase 
      titulo={'My Kudo'}
    >
      <Box>
        <Box margin={1} display="flex" flexDirection="column" component={Paper} variant = "outlined">
          <Grid container direction="column" padding={2} spacing={4}>
            {isLoading && (<Grid item>
              <LinearProgress variant="indeterminate"/>
            </Grid>
            )}
            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                <TextField
                  fullWidth
                  label="Nome"
                  disabled={isLoading}
                  placeholder="Nome" 
                  name="nome"/>
              </Grid>
            </Grid>
            <Grid container item direction="row" spacing={2}>
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
              </Grid>
            </Grid>
            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                <TextField
                  fullWidth
                  label="Teste"
                  disabled={isLoading}
                  placeholder="Teste" 
                  name="teste"/>
              </Grid>
            </Grid>            
          </Grid>
        </Box>
      </Box> 
    </LayoutBase>
  );
};