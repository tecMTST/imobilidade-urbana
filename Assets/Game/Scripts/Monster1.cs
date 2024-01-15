using UnityEngine;
using System.Collections.Generic;
using UnityEngine.UI;
using System.Collections;

public class Monster1 : MonoBehaviour
{
    public float delay = 2f;

    public float startPosition;

    public UnityEngine.Rendering.Universal.Light2D light2D;
    public Transform pivotPlayerObject;
    public Transform[] targetObject;
    public float moveSpeedNormal = 2f;
    public float moveSpeedLight = 5f;
    public GameObject player;
    public int monsterRoomIndex;
    
    [Tooltip("The time limit the player can be hidden with the torchlight on")]
    public float expositionTimeLimit;

    private float lightExpositionTime;
    private float stoppingDistance = 1f;
    private bool shouldMove = false;
    private Collider2D thisCollider;
    private bool isNearPlayer = false;
    private int index = 0;

    //Audio:
    private AudioSource audioSource;

    //Vetor Lista de Falas:
    private AudioClip[] sonoroFalaMonstro;

    //Lista de SFX:
    [SerializeField] private AudioClip sonoroScreamMonstro;
    [SerializeField] private AudioClip sonoroFalaMonstro1;
    [SerializeField] private AudioClip sonoroFalaMonstro2;
    [SerializeField] private AudioClip sonoroFalaMonstro3;
    [SerializeField] private AudioClip sonoroFalaMonstro4;
    [SerializeField] private AudioClip sonoroFalaMonstro5;

    //Variaveis Audio:
    [SerializeField] private float limitVoice = 10f;
    private float timerVoice = 0f;
    private bool huntVoice = false;
    private bool inDialogue = false;

    Animation fadeImage = null;
    Animator hands = null;

    void Start()
    {
        Invoke("StartMoving", delay);
        thisCollider = this.GetComponent<Collider2D>();
        audioSource = GetComponent<AudioSource>();

        fadeImage = FindFadeImageByTag("fadePanel", true);
        fadeImage.gameObject.SetActive(true);

        hands = FindAnimatorByTag("handsPanel", true);
        hands.gameObject.SetActive(true);

        //Vetor de Falas:
        sonoroFalaMonstro = new AudioClip[]
        {
            sonoroFalaMonstro1,
            sonoroFalaMonstro2,
            sonoroFalaMonstro3,
            sonoroFalaMonstro4,
            sonoroFalaMonstro5
        };

    }

    private void OnEnable() {
        if (Random.Range(0, 99) < 25)
            this.transform.parent.gameObject.SetActive(false);
        
        
    }

    private void OnDisable() {
        this.transform.localPosition = new Vector3(startPosition, this.transform.localPosition.y, this.transform.localPosition.z);

        if (Random.Range(0, 99) % 2 == 0)
            index = 0;
        else 
            index = 1;

        
        //Parar BGM Preseguicao:
        huntVoice = false;
        SoundManager.instance.stopBGM(3);
    }

    void Update()
    {
        if(!inDialogue){
            if (!light2D.gameObject.activeSelf) {
                if (fadeImage.IsPlaying("fadePanelOut")) {
                    fadeImage.CrossFade("fadePanelIn", 0.1f);
                    PlayIn();

                }
            }

            List<Collider2D> colliders = new ();
            ContactFilter2D contactFilter = new ContactFilter2D();
            contactFilter.NoFilter();
            
            thisCollider.OverlapCollider(contactFilter, colliders);

            bool sameRoom = (monsterRoomIndex == player.GetComponent<PlayerController>().GetRoomIndex());

            if (Vector3.Distance(this.transform.position, player.transform.position) < 8) 
            {
                isNearPlayer = true;
            }
            else
            {
                isNearPlayer = false;
            }

            if (light2D.gameObject.activeSelf && isNearPlayer && sameRoom)
            {
                Vector3 direction = pivotPlayerObject.position - transform.position;
                direction.Normalize();
                transform.Translate(direction * moveSpeedLight * Time.deltaTime, Space.World);

                if (direction.x < 0)
                {
                    // Moving left, flip the object
                    transform.localScale = new Vector3(-Mathf.Abs(transform.localScale.x), transform.localScale.y, transform.localScale.z);
                }
                else if (direction.x > 0)
                {
                    // Moving right, unflip the object
                    transform.localScale = new Vector3(Mathf.Abs(transform.localScale.x), transform.localScale.y, transform.localScale.z);
                }

                //Audio Perseguicao Normal:
                if (!huntVoice)
                {
                    SoundManager.instance.playBGM((int)SoundManager.ListaBGM.musicaChase, 3);
                    SoundManager.instance.stopBGM(2);
                    audioSource.PlayOneShot(sonoroScreamMonstro);
                    huntVoice = true;
                }

                if (Mathf.Abs(pivotPlayerObject.position.x - transform.position.x) > stoppingDistance) {

                    if (!light2D.gameObject.activeSelf)
                    {
                        SoundManager.instance.stopBGM(3);
                    }

                    lightExpositionTime = 0;

                }
                else
                {
                    //print($"PlayerObject position: {pivotPlayerObject.position}\nMonster Position: {transform.position}\n" +
                    //    $"Distance: {Mathf.Abs(pivotPlayerObject.position.x - transform.position.x)} mg ={direction.magnitude} & sqrMg {direction.sqrMagnitude}\nExposition Time: {lightExpositionTime}");

                    if (light2D.gameObject.activeSelf)
                    {
                        lightExpositionTime += Time.deltaTime;

                        if (!fadeImage.IsPlaying("fadePanelOut")) {
                            fadeImage.Play("fadePanelOut");
                            PlayOut();
                        }

                    }

                    if (lightExpositionTime > 5) {

                        SoundManager.instance.stopBGM(3);
                        GameManagement.Instance.SetPlayerPosition();
                        lightExpositionTime = 0;

                        if (fadeImage.IsPlaying("fadePanelOut")) {
                            fadeImage.CrossFade("fadePanelIn", 0.01f);
                            PlayIn();
                        }

                    }

                }

            }
            else if (shouldMove)
            {

                Vector3 direction = targetObject[index].position - transform.position;
                
                if (direction.x < 0)
                {
                    // Moving left, flip the object
                    transform.localScale = new Vector3(-Mathf.Abs(transform.localScale.x), transform.localScale.y, transform.localScale.z);
                }
                else if (direction.x > 0)
                {
                    // Moving right, unflip the object
                    transform.localScale = new Vector3(Mathf.Abs(transform.localScale.x), transform.localScale.y, transform.localScale.z);
                }

                if (direction.magnitude > stoppingDistance)
                {
                    direction.Normalize();
                    transform.Translate(direction * moveSpeedNormal * Time.deltaTime, Space.World);

                }
                else
                {
                    shouldMove = false;

                    lightExpositionTime = 0;

                    Invoke("StartMoving", delay);

                    if (index == targetObject.Length - 1)
                    {
                        index = 0;
                    }
                    else
                    {
                        index++;
                    }
                }

                //Parar BGM Preseguicao:
                huntVoice = false;
                SoundManager.instance.stopBGM(3);
            }

            //SFX Grunindos:
            timerVoice = timerVoice + Time.deltaTime;
            if (timerVoice > limitVoice && !light2D.gameObject.activeSelf && shouldMove)
            {
                audioSource.PlayOneShot(sonoroFalaMonstro[UnityEngine.Random.Range(0, 5)]);
                timerVoice = 0f;
            }

        }

       

    }

    public void StartMoving()
    {        
        shouldMove = true;
    }

    public void StartDialogue()
    {        
        inDialogue = true;
    }

    public void StopDialogue()
    {        
        inDialogue = false;
    }

    public bool IsNearPlayer()
    {
        return isNearPlayer;
    }

    void PlayIn() {
    
        hands.SetBool("handsIn", true);
    
        
    }

    void PlayOut() {

        hands.SetBool("handsIn", false);
        //hands.SetBool("handsIn", false);
        hands.SetTrigger("handsOut");
    }

    Animator FindAnimatorByTag(string tag, bool includeInactive) {

        Animator img = null;
        Animator[] fadeImg = null;

        if (includeInactive) {
            fadeImg = Resources.FindObjectsOfTypeAll<Animator>();
            foreach (Animator i in fadeImg) {
                if (i.CompareTag(tag)) {
                    img = i;
                    break;
                }
            }
        } else {

            GameObject.FindGameObjectWithTag(tag).TryGetComponent<Animator>(out img);
        }


        return img;

    }

    Animation FindFadeImageByTag(string tag, bool includeInactive) {

        Animation img = null;
        Animation[] fadeImg = null;

        if (includeInactive) {
            fadeImg = Resources.FindObjectsOfTypeAll<Animation>();
            foreach (Animation i in fadeImg) {
                if (i.CompareTag(tag)) {
                    img = i;
                    break;
                }
            }
        } else {

            GameObject.FindGameObjectWithTag(tag).TryGetComponent<Animation>(out img);    
        }

        
        return img;

    }
}