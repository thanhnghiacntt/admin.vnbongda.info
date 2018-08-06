/**
 * Created by dungdh on 31/8/2017.
 */
import * as React from 'react';
import {ConfirmationDialog} from "../../common/components/dialog/ConfirmationDialog";
import {InformationDialog} from "../../common/components/dialog/InformationDialog";
import {Grid} from "../../common/components/grid/Grid";
import {Column} from "../../common/components/grid/Column";
import {Link} from "react-router-dom";
import {SearchBox} from "../../common/components/searchbox/SearchBox";
import {Helper} from "../../utils/Helper";
import {UserService} from "../../services/UserService";
import {User} from "../../models/User";
import {Loader} from "../../common/components/loader/Loader";
import {Authentication} from "../../utils/Authentication";

interface UserState {
  query?: string,
  message?: string,
  errorMessage?: string,
  isLoading?: boolean;
  lstUsers?: User[];
  currentPage: number;
}

/**
 * users page
 */
export default class Users extends React.Component<{}, UserState> {
  private confirmationDialog: ConfirmationDialog = new ConfirmationDialog();
  private infoDialog: InformationDialog = new InformationDialog();
  private userService = new UserService();
  state: UserState = {
    lstUsers: [],
    isLoading: false,
    currentPage: 0
  };

  /**
   * Constructor
   */
  constructor(props) {
    super(props);
  };


  setQuery(query: string) {

  }

  async loading() {
    this.setState({isLoading: true});
    let response = await this.userService.getList({limit: 10, start: this.state.currentPage * 10});
    this.setState({lstUsers: response && response.data ? response.data.data : [], isLoading: false});
  }

  componentDidMount() {
    this.loading();
    Helper.setPageTitle("User Manager");
  }

  async deleteUser(id: string) {
    this.setState({message: "Are you sure you want to delete this user?"});
    let ok = await this.confirmationDialog.show();
    if (ok) {
      let response = await this.userService.deleteUser(id);
      this.setState({message: response.message});
      this.infoDialog.show();
      this.loading();
    }
  }

  render() {
    return (
      <div id="users-manager">
        <Loader isLoading={this.state.isLoading}/>
        <ConfirmationDialog icon="archive icon"
                            title="Confirmation Message"
                            message={this.state.message}
                            ref={dialog => this.confirmationDialog = dialog}/>

        <InformationDialog message={this.state.message}
                           title={"Information"}
                           ref={dialog => this.infoDialog = dialog}/>

        <div className="ui blurring content-box">
          <div className="ui secondary menu">

            <div className="right menu">
              <div className="item" style={{display: "none"}}>
                <div className="ui icon button">
                  <i className="filter icon"/>
                </div>
              </div>
              <div className="item">
                <SearchBox value={this.state.query}
                           onEnter={() => this.loading()}
                           onChange={query => this.setQuery(query)}/>
              </div>

              <div className="item">
                <Link to="users/edit"
                      className="ui icon button btn-create">
                  <i className="add icon"/>
                  Create New
                </Link>
              </div>
            </div>
          </div>
          <div className="clear"/>


          <Grid data={this.state.lstUsers||[]}
                totalItems={this.state.lstUsers?this.state.lstUsers.length:0}
                currentPage={this.state.currentPage}
                itemsPerPage={10}
                isLoading={
                              this.state.isLoading
                          }
          >
            <Column name="no"
                    renderer={(config, name, index) => {
                                    return (<span>
                    {index + 1 + this.state.currentPage * 10} </span>)
                                }}
                    width={'5%'}
                    textAlign={'center'}
                    displayName="No."/>
            <Column name="name"
                    width={"20%"}
                    renderer={(user:User) => {
                                return(<span>{user? user.firstName + " " + user.lastName : "" }</span>)
                                }}
                    displayName="Name"/>
            <Column name="email"
                    displayName="Email"
                    width={"30%"}
            />
            <Column name="role"
                    displayName="Role"
                    width={"15%"}
            />

            <Column name="actions"
                    displayName="Actions"
                    renderer={(user:User) => (
                      <div>
                        <Link
                            to={"/users/edit/" + user.id}
                            className={"ui mini icon button "}>
                            <i className="edit icon"/>
                            Edit
                        </Link>
                        <a style={{disabled: user.id==Authentication.getUser().id}}
                            onClick={() => {
                            if(user.id==Authentication.getUser().id)
                              return;
                            this.deleteUser(user.id)
                            }}
                            className={"ui mini icon button" + (user.id==Authentication.getUser().id? ' disabled':"" )}>
                            <i className="delete icon"/>
                            Delete
                        </a>
                      </div>
                                )}/>
          </Grid>

        </div>
      </div>
    );
  }
}
