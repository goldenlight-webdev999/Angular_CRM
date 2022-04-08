import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { FileObject } from '../models/file-object.model';
import { Contact } from '../models/contact.model';

@Injectable()
export class MetacleanerAPIService {

    private url: string;
    private clientId: string;
    private clientSecret: string;
    private profileData: any;
    private historyData: any;
    private userApplications: any;

    /**
     * MetacleanerAPIService constructor
     *
     * @param http
     */
    constructor(
        private http: HttpClient,
    ) {
        this.url = environment.api_url;
        this.clientId = environment.client_id;
        this.clientSecret = environment.client_secret;
    }

    /**
     * Upload file to backend
     *
     * @param file
     * @param useAccount
     */
    public uploadFile<T>(file: FileObject, useAccount: boolean): Observable<T> {
        let path = '/public/api/files';

        if (useAccount) {
            path = '/api/files';
        }
        return this.http.post<T>(this.url + path, JSON.stringify(file));
    }
    
    /**
     * Get metadata of file from backend
     *
     * @param file
     */
     public getFileMetaData<T>(file: FileObject): Observable<T> {
        let path = '/api/getFileMetadata';
        return this.http.post<T>(this.url + path, JSON.stringify(file));
    }


    /**
     * Update metadata of file from backend
     *
     * @param file
     */
     public updateFileMetaData<T>(file: FileObject, data: any): Observable<T> {
        let path = '/api/updateFileMetaData';
        const params = {
            file: file,
            metadata: data
        }
        return this.http.post<T>(this.url + path, JSON.stringify(params));
    }
    

    /**
     * Login user
     *
     * @param logInfo
     */
    public login<T>(logInfo: object): Observable<T> {
        const authPath = '/oauth/v2/token';
        const path = this.url + authPath;

        const params = [
            'grant_type=password',
            'username=' + logInfo['username'],
            'password=' + logInfo['password'],
            'captcha=' + logInfo['captcha'],
            'client_id=' + this.clientId,
            'client_secret=' + this.clientSecret,
        ].join('&');

        return this.http.post<T>(path, params, {
            headers: new HttpHeaders({
                'Content-Type':  'application/x-www-form-urlencoded',
            })
        });
    }

    /**
     * Register user
     *
     * @param regInfo
     */
    public register<T>(regInfo: object): Observable<T> {
        return this.http.post<T>(this.url + '/security/sign-up', regInfo);
    }

    /**
     * Logout user from backend
     *
     * @param userToken
     */
    public logout<T>(userToken: object): Observable<T> {
        return this.http.delete<T>(this.url + '/api/users/me/tokens/' + userToken);
    }

    /**
     * Send contact form info to the backend
     *
     * @param contactInfo
     */
    public contact<T>(contactInfo: Contact): Observable<T> {
        return this.http.post<T>(this.url + '/public/api/contact', JSON.stringify(contactInfo));
    }

    /**
     * Create a user subscription
     *
     * @param plan
     */
    public createSubscription<T>(plan: object): Observable<T> {
        return this.http.post<T>(this.url + '/api/users/me/subscriptions', JSON.stringify(plan));
    }

    /**
     * Change user subscription
     *
     * @param plan
     */
    public changeSubscription<T>(plan: object): Observable<T> {
        return this.http.post<T>(this.url + '/api/users/me/subscriptions', JSON.stringify(plan));
    }

    /**
     * Change user payment card
     *
     * @param token
     */
    public changePaymentCard<T>(token: object): Observable<T> {
        return this.http.patch<T>(this.url + '/api/users/me/subscriptions', JSON.stringify(token));
    }

    /**
     * Get user profile
     */
    public getProfile<T>(): Observable<T> {
        return new Observable<T>(observer => {
            if (this.profileData) {
                observer.next(this.profileData);
            }

            this.http.get<T>(this.url + '/api/users/me').subscribe(
                response => {
                    this.profileData = response;
                    observer.next(this.profileData);
                    observer.complete();
                },
                response => {
                    observer.error(response);
                },
                () => {
                    observer.complete();
                }
            );
        });
    }

    /**
     * Get current user history
     */
    public getHistory<T>(): Observable<T> {
        return new Observable<T>(observer => {
            if (this.historyData) {
                observer.next(this.historyData);
            }

            this.http.get<T>(this.url + '/api/users/me/history').subscribe(
                response => {
                    this.historyData = response;
                    observer.next(this.historyData);
                    observer.complete();
                },
                response => {
                    observer.error(response);
                },
                () => {
                    observer.complete();
                }
            );
        });
    }

    /**
     * Get current user applications
     */
    public getApplications<T>(): Observable<T> {
        return new Observable<T>(observer => {
            if (this.userApplications) {
                observer.next(this.userApplications);
            }

            this.http.get<T>(this.url + '/api/users/me/applications').subscribe(
                response => {
                    this.historyData = response;
                    observer.next(this.historyData);
                    observer.complete();
                },
                response => {
                    observer.error(response);
                },
                () => {
                    observer.complete();
                }
            );
        });
    }

    /**
     * Set current user applications
     */
    public setApplication<T>(application: object): Observable<T> {
        return this.http.post<T>(this.url + '/api/users/me/applications', JSON.stringify(application));
    }

    /**
     * Remove current user application by ID
     */
    public removeApplication<T>(applicationId: string): Observable<T> {
        return this.http.delete<T>(this.url + '/api/users/me/applications/' + applicationId);
    }

    /**
     * Get user history by ID
     *
     * @param userId
     */
    public getUserHistory<T>(userId: string): Observable<T> {
        return this.http.get<T>(this.url + '/api/users/' + userId + '/history');
    }

    /**
     * Get user subscriptions
     */
    public getSubscriptions<T>(): Observable<T> {
        return this.http.get<T>(this.url + '/api/users/me/subscriptions');
    }

    /**
     * Send the invalid extensions to the backend
     *
     * @param extensions
     */
    public invalidExtensions<T>(extensions: Array<string>): Observable<T> {
        return this.http.post<T>(this.url + '/public/api/extensions', JSON.stringify(extensions));
    }

    /**
     * Get payment checkoutSession
     */

    public getCheckoutSession<T>(lookupKey: string): Observable<T> {
        return this.http.get<T>(this.url + '/api/users/me/checkout/' + lookupKey);
    }

    /**
     * Get paypal payment checkoutSession
     */

    public getPaypalCheckoutSession<T>(lookupKey: string): Observable<T> {
        return this.http.get<T>(this.url + '/api/users/me/paypal/' + lookupKey);
    }

    /**
     * Send email verification
     */
    public sendEmailVerification<T>(emailAddress: string): Observable<T> {
        return this.http.post<T>(this.url + '/public/api/sendEmailVerification', '{"email": "'+emailAddress+'"}');
    }

    /**
     * Validate email verification token
     */
    public validateEmailVerification<T>(token: string, expiry: string, uuid: string): Observable<T> {
        return this.http.get<T>(this.url + '/public/api/validate/' + token + '/' + expiry + '/' + uuid);
    }

    /**
     * Send email passsord reset
     */
    public sendResetPassword<T>(emailAddress: string): Observable<T> {
        return this.http.post<T>(this.url + '/public/api/forgot_password', '{"email": "'+emailAddress+'"}');
    }

    /**
     * Validate password reset token
     */
    public validateResetPassword<T>(token: string, expiry: string, uuid: string, password: string): Observable<T> {
        return this.http.post<T>(this.url + '/public/api/forgot_password/' + token + '/' + expiry + '/' + uuid, '{"password": "' + password + '"}');
    }



}
